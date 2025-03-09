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
        
        // In your surveyController.js
        getAllSurveysWithSections: async (req, res) => {
            try {
                const result = await pool.query(`
                    SELECT s.id AS survey_id, s.title AS survey_title, s.description AS survey_description, s.status AS survey_status,
                        sec.id AS section_id, sec.title AS section_title
                    FROM "CSS".survey s
                    LEFT JOIN "CSS".section sec ON s.id = sec.survey_id
                `);
                
                const surveys = result.rows;
                res.json(surveys);
            } catch (error) {
                console.error("Error fetching surveys with sections:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        },

        getAllSurveysWithDetails: async () => {
            try {
                const result = await pool.query(`
                    SELECT 
                        s.id AS survey_id, s.title AS survey_title, s.description AS survey_description, s.status AS survey_status,
                        sec.id AS section_id, sec.title AS section_title, sec.description AS section_description,
                        q.id AS question_id, q.text AS question_text, q.type AS question_type,
                        o.id AS option_id, o.text AS option_text
                    FROM "CSS".survey s
                    LEFT JOIN "CSS".section sec ON s.id = sec.survey_id
                    LEFT JOIN "CSS".question q ON sec.id = q.section_id
                    LEFT JOIN "CSS".option o ON q.id = o.question_id
                `);
    
                if (!result.rows || result.rows.length === 0) {
                    console.error("No surveys found.");
                    return [];
                }
    
                // Restructure into a nested JSON format
                const surveysMap = new Map();
    
                result.rows.forEach(row => {
                    // Get or create survey entry
                    if (!surveysMap.has(row.survey_id)) {
                        surveysMap.set(row.survey_id, {
                            id: row.survey_id,
                            title: row.survey_title,
                            description: row.survey_description,
                            status: row.survey_status,
                            sections: []
                        });
                    }
                    const survey = surveysMap.get(row.survey_id);
    
                    // Get or create section entry
                    let section = survey.sections.find(sec => sec.id === row.section_id);
                    if (!section) {
                        section = {
                            id: row.section_id,
                            title: row.section_title,
                            description: row.section_description,
                            questions: []
                        };
                        survey.sections.push(section);
                    }
    
                    // Get or create question entry
                    let question = section.questions.find(q => q.id === row.question_id);
                    if (!question) {
                        question = {
                            id: row.question_id,
                            text: row.question_text,
                            type: row.question_type,
                            options: []
                        };
                        section.questions.push(question);
                    }
    
                    // Add option to question if exists
                    if (row.option_id) {
                        question.options.push({
                            id: row.option_id,
                            text: row.option_text
                        });
                    }
                });
    
                return Array.from(surveysMap.values()); // Convert Map to array
            } catch (error) {
                console.error("Error fetching surveys with details:", error);
                throw error;
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
        }, 

        updateSurveyDetails: async (surveyId, title, description, sections) => {
            const client = await pool.connect();
            try {
                await client.query("BEGIN"); // Start transaction
        
                // ✅ Update the survey details (without updating status)
                await client.query(
                    `UPDATE "CSS".survey 
                     SET title = $1, description = $2
                     WHERE id = $3`,
                    [title, description, surveyId]
                );
        
                // ✅ Update or insert sections, questions, and options
                for (const section of sections) {
                    let sectionId = section.id;
                    
                    if (sectionId) {
                        // Update existing section
                        await client.query(
                            `UPDATE "CSS".section 
                             SET title = $1, description = $2 
                             WHERE id = $3`,
                            [section.title, section.description, sectionId]
                        );
                    } else {
                        // Insert new section
                        const sectionResult = await client.query(
                            `INSERT INTO "CSS".section (survey_id, title, description) 
                             VALUES ($1, $2, $3) RETURNING id`,
                            [surveyId, section.title, section.description]
                        );
                        sectionId = sectionResult.rows[0].id;
                    }
        
                    for (const question of section.questions) {
                        let questionId = question.id;
        
                        if (questionId) {
                            // Update existing question
                            await client.query(
                                `UPDATE "CSS".question 
                                 SET text = $1, type = $2 
                                 WHERE id = $3`,
                                [question.text, question.type, questionId]
                            );
                        } else {
                            // Insert new question
                            const questionResult = await client.query(
                                `INSERT INTO "CSS".question (section_id, text, type) 
                                 VALUES ($1, $2, $3) RETURNING id`,
                                [sectionId, question.text, question.type]
                            );
                            questionId = questionResult.rows[0].id;
                        }
        
                        for (const option of question.options) {
                            if (option.id) {
                                // Update existing option
                                await client.query(
                                    `UPDATE "CSS".option 
                                     SET text = $1 
                                     WHERE id = $2`,
                                    [option.text, option.id]
                                );
                            } else {
                                // Insert new option
                                await client.query(
                                    `INSERT INTO "CSS".option (question_id, text) 
                                     VALUES ($1, $2)`,
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
                console.error("Error updating survey details:", error);
                throw error;
            } finally {
                client.release();
            }
        },        
    }

    module.exports = Survey;

