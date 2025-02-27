    const pool = require('../db');

    const Survey = {
        // Get all surveys
        getAllSurveys: async () => {
            const result = await pool.query('SELECT * FROM "CSS".survey');
            return result.rows;
        },

        getSurveyById: async (surveyId) => {
            const result = await pool.query(
                `SELECT s.id as survey_id, s.title as survey_title, s.description as survey_description, 
                        s.status as survey_status, 
                        sec.id as section_id, sec.title as section_title, sec.description as section_description,
                        q.id as question_id, q.text as question_text, q.type as question_type,
                        o.id as option_id, o.text as option_text
                FROM "CSS".survey s
                LEFT JOIN "CSS".section sec ON s.id = sec.survey_id
                LEFT JOIN "CSS".question q ON sec.id = q.section_id
                LEFT JOIN "CSS".option o ON q.id = o.question_id
                WHERE s.id = $1`,
                [surveyId]
            );
        
            // Restructure the response to nested JSON format
            const surveyData = {};
            result.rows.forEach(row => {
                if (!surveyData.id) {
                    surveyData.id = row.survey_id;
                    surveyData.title = row.survey_title;
                    surveyData.description = row.survey_description;
                    surveyData.status = row.survey_status;
                    surveyData.sections = [];
                }
        
                let section = surveyData.sections.find(sec => sec.id === row.section_id);
                if (!section) {
                    section = {
                        id: row.section_id,
                        title: row.section_title,
                        description: row.section_description,
                        questions: [],
                    };
                    surveyData.sections.push(section);
                }
        
                let question = section.questions.find(q => q.id === row.question_id);
                if (!question) {
                    question = {
                        id: row.question_id,
                        text: row.question_text,
                        type: row.question_type,
                        options: [],
                    };
                    section.questions.push(question);
                }
        
                if (row.option_id) {
                    question.options.push({
                        id: row.option_id,
                        text: row.option_text,
                    });
                }
            });
        
            return surveyData;
        },
                

        createSurveyWithQuestions: async (title, description, sections) => {
            const client = await pool.connect();
            try {
                await client.query("BEGIN"); // Start transaction
        
                // Insert the survey
                const surveyResult = await client.query(
                    'INSERT INTO "CSS".survey (title, description) VALUES ($1, $2) RETURNING id',
                    [title, description]
                );
                const surveyId = surveyResult.rows[0].id;
        
                for (const section of sections) {
                    const sectionResult = await client.query(
                        'INSERT INTO "CSS".section (survey_id, title, description) VALUES ($1, $2, $3) RETURNING id',
                        [surveyId, section.title, section.description || "No description"]
                    );
                    const sectionId = sectionResult.rows[0].id;
        
                    for (const question of section.questions) {
                        const questionResult = await client.query(
                            'INSERT INTO "CSS".question (section_id, text, type) VALUES ($1, $2, $3) RETURNING id',
                            [sectionId, question.text || "Untitled Question", question.type]
                        );
                        const questionId = questionResult.rows[0].id;
                    
                        for (const option of question.options || []) {
                            if (option.text.trim() !== "") { // Ensure text is not empty
                                await client.query(
                                    'INSERT INTO "CSS".option (question_id, text) VALUES ($1, $2)',
                                    [questionId, option.text]
                                );
                            }
                        }
                    }                    
                }
        
                await client.query("COMMIT"); // Commit transaction
                return { id: surveyId, title, description };
            } catch (error) {
                await client.query("ROLLBACK"); // Rollback on error
                throw error;
            } finally {
                client.release();
            }
        },                

        updateSurveyStatus: async (surveyId, status) => {
            try {
                const result = await pool.query(
                    'UPDATE "CSS".survey SET status = $1 WHERE id = $2 RETURNING *',
                    [status, surveyId]
                );
    
                return result.rows[0]; // Return updated survey
            } catch (error) {
                console.error("Error updating survey status:", error);
                throw error;
            }
        }
    }

    module.exports = Survey;

