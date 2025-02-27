const express = require("express");
const router = express.Router();
const { getAssignedOptionsByType, getAssignedOptionsById } = require("../controller/questionOptionController");

// Route to get questions with options by type
router.get("/question-options/survey/:surveyId/type/:type", getAssignedOptionsByType);

// Route to get a specific question with options by question ID
router.get("/question-options/survey/:surveyId/id/:questionId", getAssignedOptionsById);

// Route to get a specific question survey ID
router.get("/question-options/survey/:surveyId", async (req, res) => {
    try {
      const { surveyId } = req.params;
      const result = await pool.query(
        `SELECT q.id AS question_id, q.text AS question_text, q.survey_id, o.id AS option_id, o.text AS option_text
         FROM "CSS"."question_option" qo
         JOIN "CSS"."question" q ON qo.question_id = q.id
         JOIN "CSS"."option" o ON qo.option_id = o.id
         WHERE q.survey_id = $1
         ORDER BY q.id, o.id;`,
        [surveyId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "No questions found for this survey." });
      }
  
      // Organizing response structure
      const formattedData = {};
      result.rows.forEach((row) => {
        if (!formattedData[row.question_id]) {
          formattedData[row.question_id] = {
            id: row.question_id,
            text: row.question_text,
            options: [],
          };
        }
        formattedData[row.question_id].options.push({
          id: row.option_id,
          text: row.option_text,
        });
      });
  
      res.status(200).json(Object.values(formattedData));
    } catch (error) {
      console.error("Error fetching options by survey ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
module.exports = router;
