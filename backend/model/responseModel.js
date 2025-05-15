const pool = require("../db");

// Fetch all responses for a specific survey
const getResponsesBySurvey = async (surveyId) => {
    const query = `
        SELECT * FROM "CSS".response
        WHERE survey_id = $1;
    `;
    const values = [surveyId];
    const result = await pool.query(query, values);
    return result.rows;
};

const insertSelectedPersonnel = async (responseId, selectedPersonnel) => {
    const query = `
        INSERT INTO "CSS".selected_personnel (response_id, personnel_id)
        VALUES ($1, $2)
    `;
    for (const personnelId of selectedPersonnel) {
        try {
            console.log(`Inserting personnelId ${personnelId} for responseId ${responseId}`);
            await pool.query(query, [responseId, personnelId]);
        } catch (error) {
            console.error(`Failed to insert personnelId ${personnelId}:`, error.message);
        }
    }
};


// Insert response into the response table and return the inserted ID
const insertResponse = async (survey_id, office_id, type, role, sex, age, region, comment, email, phone, selected_service) => {
    const query = `
        INSERT INTO "CSS".response (survey_id, office_id, type, role, sex, age, region, comment, email, phone, selected_service)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
        comment,  // Include the comment in the values array
        email ? email : null, // Insert null if email is an empty string
        phone ? phone : null, // Insert null if phone is an empty string
        selected_service ? selected_service : null // Store the selected service or "Other"
    ];
    const result = await pool.query(query, values);
    return result.rows[0].id;
};

// Insert answers into the answer table
const insertAnswers = async (answers, responseId) => {
    const query = `
        INSERT INTO "CSS".answer (question_id, response_id, text) VALUES ($1, $2, $3);
    `;
    for (const answer of answers) {
        console.log("Inserting Answer:", {
            questionId: answer.questionId,
            responseId: responseId,
            text: answer.value
        });
        try {
            await pool.query(query, [answer.questionId, responseId, answer.value]);
        } catch (error) {
            console.error("Error inserting answer:", error.message);
            throw error; // Rethrow the error to handle it in the calling function
        }
    };
};

// Fetch responses by officeId and surveyId
const getResponsesByOfficeAndSurvey = async (officeId, surveyId) => {
    const query = `
        SELECT * FROM "CSS".response
        WHERE office_id = $1 AND survey_id = $2;
    `;
    const values = [officeId, surveyId];
    const result = await pool.query(query, values);
    return result.rows;
};

module.exports = {
    getResponsesBySurvey,
    insertSelectedPersonnel,
    insertResponse,
    insertAnswers,
    getResponsesByOfficeAndSurvey
};