const Survey = require("../model/surveyModel");

const surveyController = {
    createSurvey: async (req, res) => {
        try {
            const { title, description, sections } = req.body;
            if (!title || !description || !sections || sections.length === 0) {
                return res.status(400).json({ message: "Title, description, and sections are required." });
            }

            const newSurvey = await Survey.createSurveyWithQuestions(title, description, sections);
            res.status(201).json({ message: "Survey created successfully", survey: newSurvey });
        } catch (error) {
            console.error("Error creating survey:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    getAllSurveys: async (req, res) => {
        try {
            const surveys = await Survey.getAllSurveys();
            res.json(surveys);
        } catch (error) {
            console.error("Error fetching surveys:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    getSurveyById: async (req, res) => {
        try {
            const { id } = req.params;
            const survey = await Survey.getSurveyById(id);

            if (!survey.id) {
                return res.status(404).json({ message: "Survey not found" });
            }

            res.json(survey);
        } catch (error) {
            console.error("Error fetching survey:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    updateSurveyStatus: async (req, res) => { // ✅ Fixed syntax
        const { id } = req.params;
        const { status } = req.body; // Expecting { "status": "Active" or "Inactive" }
    
        try {
            const isActive = status === "Active"; // Convert to boolean
            const result = await pool.query(
                'UPDATE "CSS".surveys SET active = $1 WHERE id = $2 RETURNING *', 
                [isActive, id]
            );
    
            if (result.rowCount === 0) {
                return res.status(404).json({ error: "Survey not found" });
            }
    
            res.json(result.rows[0]); // Return updated survey
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Database error" });
        }
    },

    updateSurveyStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
                

            if (!status) {
                return res.status(400).json({ message: "Status is required" });
            }

            const updatedSurvey = await Survey.updateSurveyStatus(id, status);

            if (!updatedSurvey) {
                return res.status(404).json({ message: "Survey not found" });
            }

            res.json({ message: "Survey status updated successfully", survey: updatedSurvey });
        } catch (error) {
            console.error("Error updating survey status:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
};

module.exports = surveyController;
