const { insertResponse, insertAnswers } = require("../model/responseModel");
const pool = require("../db");

const storeSurveyResponse = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN"); // Start transaction

        const { survey_id, office_id, type, role, sex, age, region, comment, email, phone, answers } = req.body;

        // Log the request body for debugging
        console.log("Request Body:", req.body);

        if (!survey_id || !office_id || !type || !role || !sex || !age || !region || !answers || answers.length === 0) {
            return res.status(400).json({ message: "Missing required fields or no answers provided." });
        }

        // Insert user response and get the response ID
        const responseId = await insertResponse(survey_id, office_id, type, role, sex, age, region,comment, email, phone);

        // Insert answers linked to the response ID
        await insertAnswers(answers, responseId);

        await client.query("COMMIT"); // Commit transaction

        res.status(201).json({ message: "Survey response and answers saved successfully", response_id: responseId });
    } catch (error) {
        await client.query("ROLLBACK"); // Rollback transaction on error
        console.error("Error saving survey response:", error.message); // Log the exact error
        res.status(500).json({ message: "Server error", error: error.message }); // Return error details    
    } finally {
        client.release();
    }
};

module.exports = { storeSurveyResponse };
