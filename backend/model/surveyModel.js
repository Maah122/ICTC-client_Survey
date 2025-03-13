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
                        q.id as question_id, q.text as question_text, q.type as question_type, q.isrequired as question_required,
                        o.id as option_id, o.text as option_text
                FROM "CSS".survey s
                LEFT JOIN "CSS".section sec ON s.id = sec.survey_id
                LEFT JOIN "CSS".question q ON sec.id = q.section_id
                LEFT JOIN "CSS".option o ON q.id = o.question_id
                WHERE s.id = $1
                ORDER BY sec.id, q.id`, // Sort by section ID and question ID
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
                        required: row.question_required, // Ensure this is correctly set
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
                                'INSERT INTO "CSS".question (section_id, text, type, isrequired) VALUES ($1, $2, $3, $4) RETURNING id',
                                [sectionId, question.text || "Untitled Question", question.type, question.isrequired] // Ensure isrequired is passed
                            );
                            console.log(questionResult);
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
                await client.query("BEGIN");
        
                // Log incoming data
                console.log("Incoming data:", { surveyId, title, description, sections });
        
                // Update survey
                const updateSurveyRes = await client.query(
                    `UPDATE "CSS".survey 
                     SET title = $1, description = $2
                     WHERE id = $3 RETURNING *`, // Use RETURNING to get the updated survey
                    [title, description, surveyId]
                );
        
                // Check if the survey was updated
                if (updateSurveyRes.rowCount === 0) {
                    console.log("No survey found with the given ID.");
                    return null; // Return null if no survey was updated
                }
        
                const updatedSurvey = updateSurveyRes.rows[0]; // Get the updated survey
                console.log("Updated survey:", updatedSurvey);
        
                // Sort sections by ID in ascending order
                sections.sort((a, b) => a.id - b.id);
                console.log("Sorted sections:", sections);
        
                // Fetch existing section IDs from DB
                const existingSectionsRes = await client.query(
                    `SELECT id FROM "CSS".section WHERE survey_id = $1`,
                    [surveyId]
                );
                const existingSectionIds = existingSectionsRes.rows.map(row => row.id);
                console.log("Existing section IDs:", existingSectionIds);
        
                const incomingSectionIds = sections.filter(s => s.id).map(s => s.id);
                const sectionIdsToDelete = existingSectionIds.filter(id => !incomingSectionIds.includes(id));
                console.log("Section IDs to delete:", sectionIdsToDelete);
        
                // Delete removed sections
                for (const sectionId of sectionIdsToDelete) {
                    await client.query(`DELETE FROM "CSS".section WHERE id = $1`, [sectionId]);
                    console.log(`Deleted section ID: ${sectionId}`);
                }
        
                for (const section of sections) {
                    let sectionId = section.id;
        
                    // Sort questions by ID in ascending order
                    section.questions.sort((a, b) => a.id - b.id);
                    console.log("Sorted questions for section:", sectionId, section.questions);
        
                    if (sectionId) {
                        // Update existing section
                        await client.query(
                            `UPDATE "CSS".section 
                             SET title = $1, description = $2 
                             WHERE id = $3`,
                            [section.title, section.description, sectionId]
                        );
                        console.log(`Updated section ID: ${sectionId}`);
                    } else {
                        // Insert new section
                        const sectionResult = await client.query(
                            `INSERT INTO "CSS".section (survey_id, title, description) 
                             VALUES ($1, $2, $3) RETURNING id`,
                            [surveyId, section.title, section.description]
                        );
                        sectionId = sectionResult.rows[0].id;
                        console.log(`Inserted new section ID: ${sectionId}`);
                    }
        
                    // Fetch existing questions for the section
                    const existingQuestionsRes = await client.query(
                        `SELECT id FROM "CSS".question WHERE section_id = $1`,
                        [sectionId]
                    );
                    const existingQuestionIds = existingQuestionsRes.rows.map(row => row.id);
                    console.log("Existing question IDs for section:", sectionId, existingQuestionIds);
        
                    const incomingQuestionIds = section.questions.filter(q => q.id).map(q => q.id);
                    const questionIdsToDelete = existingQuestionIds.filter(id => !incomingQuestionIds.includes(id));
                    console.log("Question IDs to delete:", questionIdsToDelete);
        
                    // Delete removed questions
                    for (const questionId of questionIdsToDelete) {
                        await client.query(`DELETE FROM "CSS".question WHERE id = $1`, [questionId]);
                        console.log(`Deleted question ID: ${questionId}`);
                    }
        
                    for (const question of section.questions) {
                        let questionId = question.id;
                    
                        // Ensure required is a boolean
                        const isRequired = question.required === null ? false : question.required;
                    
                        if (questionId) {
                            // Update existing question
                            await client.query(
                                `UPDATE "CSS".question 
                                 SET text = $1, type = $2, isrequired = $3::BOOLEAN
                                 WHERE id = $4`,
                                [question.text, question.type, isRequired, questionId] // Use isRequired here
                            );
                            console.log(`Updated question ID: ${questionId}`);
                        } else {
                            // Insert new question
                            const questionResult = await client.query(
                                `INSERT INTO "CSS".question (section_id, text, type, isrequired) 
                                 VALUES ($1, $2, $3, $4::BOOLEAN) RETURNING id`,
                                [sectionId, question.text, question.type, isRequired] // Use isRequired here
                            );
                            questionId = questionResult.rows[0].id;
                            console.log(`Inserted new question ID: ${questionId}`);
                        }
                        
                        // Fetch existing options for the question
                        const existingOptionsRes = await client.query(
                            `SELECT id FROM "CSS".option WHERE question_id = $1`,
                            [questionId]
                        );
                        const existingOptionIds = existingOptionsRes.rows.map(row => row.id);
                        console.log("Existing option IDs for question:", questionId, existingOptionIds);
        
                        const incomingOptionIds = question.options.filter(o => o.id).map(o => o.id);
                        const optionIdsToDelete = existingOptionIds.filter(id => !incomingOptionIds.includes(id));
                        console.log("Option IDs to delete:", optionIdsToDelete);
        
                        // Delete removed options
                        for (const optionId of optionIdsToDelete) {
                            await client.query(`DELETE FROM "CSS".option WHERE id = $1`, [optionId]);
                            console.log(`Deleted option ID: ${optionId}`);
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
                                console.log(`Updated option ID: ${option.id}`);
                            } else {
                                // Insert new option
                                await client.query(
                                    `INSERT INTO "CSS".option (question_id, text) 
                                     VALUES ($1, $2)`,
                                    [questionId, option.text]
                                );
                                console.log(`Inserted new option for question ID: ${questionId}`);
                            }
                        }
                    }
                }
        
                await client.query("COMMIT");
                console.log("Survey update completed successfully.");
                return updatedSurvey; // Return the updated survey
            } catch (error) {
                await client.query("ROLLBACK");
                console.error("Error updating survey details:", error);
                throw error; // Rethrow the error for further handling
            } finally {
                client.release();
            }
        },

        deleteSurvey: async (surveyId) => {
            const client = await pool.connect();
            try {
                await client.query("BEGIN"); // Start transaction
        
                // First, delete all options related to questions in the survey
                await client.query(
                    `DELETE FROM "CSS".option 
                     WHERE question_id IN (
                         SELECT id FROM "CSS".question 
                         WHERE section_id IN (
                             SELECT id FROM "CSS".section 
                             WHERE survey_id = $1
                         )
                     )`,
                    [surveyId]
                );
        
                // Then, delete all questions related to sections in the survey
                await client.query(
                    `DELETE FROM "CSS".question 
                     WHERE section_id IN (
                         SELECT id FROM "CSS".section 
                         WHERE survey_id = $1
                     )`,
                    [surveyId]
                );
        
                // Next, delete all sections related to the survey
                await client.query(
                    `DELETE FROM "CSS".section 
                     WHERE survey_id = $1`,
                    [surveyId]
                );
        
                // Finally, delete the survey itself
                await client.query(
                    `DELETE FROM "CSS".survey 
                     WHERE id = $1`,
                    [surveyId]
                );
        
                await client.query("COMMIT"); // Commit transaction
                return { message: "Survey deleted successfully." };
            } catch (error) {
                await client.query("ROLLBACK"); // Rollback on error
                console.error("Error deleting survey:", error);
                throw error;
            } finally {
                client.release();
            }
        }
    }

    module.exports = Survey;

