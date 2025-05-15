const { getResponsesBySurvey, insertselected_personnel , insertResponse, insertAnswers, getResponsesByOfficeAndSurvey } = require("../model/responseModel"); // Ensure the correct path to your model
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

const storeSurveyResponse = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        console.log("Received request body:", req.body);

        const {
            survey_id,
            office_id,
            type,
            role,
            sex,
            age,
            region,
            comment,
            email,
            phone,
            selected_service,
            answers,
            selected_personnel  // array of IDs or ["unspecified"]
        } = req.body;

        console.log("Parsed fields:");
        console.log("survey_id:", survey_id);
        console.log("office_id:", office_id);
        console.log("selected_personnel :", selected_personnel );

        // Ensure selected_personnel  is always an array
        const personnel = Array.isArray(selected_personnel ) ? selected_personnel  : [];

        if (!survey_id || !office_id || !type || !role || !sex || !age || !region || !answers || answers.length === 0) {
            return res.status(400).json({ message: "Missing required fields or no answers provided." });
        }

        // Check for "unspecified" personnel
        const cannotSpecify = personnel.includes("unspecified");

        // Insert response, include cannot_specify_personnel
        const responseInsertQuery = `
            INSERT INTO "CSS".response (
                survey_id, office_id, type, role, sex, age, region,
                comment, email, phone, selected_service, cannot_specify_personnel
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING id;
        `;
        const values = [
            survey_id,
            office_id,
            type,
            role,
            sex,
            age,
            region,
            comment || null,
            email || null,
            phone || null,
            selected_service || null,
            cannotSpecify
        ];
        const responseResult = await client.query(responseInsertQuery, values);
        const responseId = responseResult.rows[0].id;

        // Insert answers directly in the controller
        const answerInsertQuery = `
            INSERT INTO "CSS".answer (question_id, response_id, text)
            VALUES ($1, $2, $3);
        `;
        for (const answer of answers) {
            await client.query(answerInsertQuery, [answer.questionId, responseId, answer.value]);
        }

        console.log("Inserting personnel for responseId:", responseId);
        console.log("Personnel IDs:", personnel);

        if (!cannotSpecify && personnel.length > 0) {
            const personnelInsertQuery = `
                INSERT INTO "CSS".selected_personnel (response_id, personnel_id)
                VALUES ($1, $2);
            `;
            for (const personnelId of personnel) {
                try {
                    await client.query(personnelInsertQuery, [responseId, personnelId]);
                    console.log(`Inserted personnelId ${personnelId} for responseId ${responseId}`);
                } catch (error) {
                    console.error(`Failed to insert personnelId ${personnelId}:`, error.message);
                }
            }
        }

        await client.query("COMMIT");

        res.status(201).json({
            message: "Survey response and answers saved successfully",
            response_id: responseId
        });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error saving survey response:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    } finally {
        client.release();
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