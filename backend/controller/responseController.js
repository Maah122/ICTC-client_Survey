const { getResponsesBySurvey, insertResponse, insertAnswers, getResponsesByOfficeAndSurvey } = require("../model/responseModel"); // Ensure the correct path to your model
const pool = require("../db");


const getResponsesBySurveyController = async (req, res) => {
    const { surveyId } = req.params; // Get surveyId from request parameters
    try {
        const responses = await getResponsesBySurvey(surveyId);
        res.status(200).json(responses);
    } catch (error) {
        console.error("Error fetching responses:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Controller to store survey response
const storeSurveyResponse = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN"); // Start transaction

        const { survey_id, office_id, type, role, sex, age, region, comment, email, phone, answers } = req.body;

        // Log the request body for debugging
        console.log("Request Body:", req.body);

        // Validate required fields
        if (!survey_id || !office_id || !type || !role || !sex || !age || !region || !answers || answers.length === 0) {
            return res.status(400).json({ message: "Missing required fields or no answers provided." });
        }

        // Insert user response and get the response ID
        const responseId = await insertResponse(survey_id, office_id, type, role, sex, age, region, comment, email, phone);

        // Insert answers linked to the response ID
        await insertAnswers(answers, responseId);

        await client.query("COMMIT"); // Commit transaction

        res.status(201).json({ message: "Survey response and answers saved successfully", response_id: responseId });
    } catch (error) {
        await client.query("ROLLBACK"); // Rollback transaction on error
        console.error("Error saving survey response:", error.message); // Log the exact error
        res.status(500).json({ message: "Server error", error: error.message }); // Return error details    
    } finally {
        client.release(); // Release the database client
    }
};

// Controller to handle fetching responses by officeId and surveyId
const fetchResponsesByOfficeAndSurvey = async (req, res) => {
    const { officeId, surveyId } = req.params;

    try {
        const responses = await getResponsesByOfficeAndSurvey(officeId, surveyId);
        res.status(200).json(responses);
    } catch (error) {
        console.error("Error fetching responses:", error.message);
        res.status(500).json({ error: "Failed to fetch responses" });
    }
};

module.exports = { getResponsesBySurveyController, storeSurveyResponse, fetchResponsesByOfficeAndSurvey };