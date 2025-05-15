const { getQuestionsByType, getQuestionWithOptionsById } = require("../model/questionOptionModel");

// Get questions with options by type
const getAssignedOptionsByType = async (req, res) => {
  try {
    const { type } = req.params;
    if (!type) return res.status(400).json({ error: "Type is required" });

    const rows = await getQuestionsByType(type);
    if (rows.length === 0) return res.status(404).json({ message: "No data found for this type" });

    // Organizing response structure
    const formattedData = {};
    rows.forEach((row) => {
      if (!formattedData[row.survey_id]) {
        formattedData[row.survey_id] = {};
      }

      if (!formattedData[row.survey_id][row.question_id]) {
        formattedData[row.survey_id][row.question_id] = {
          id: row.question_id,
          text: row.question_text,
          options: [],
        };
      }
      formattedData[row.survey_id][row.question_id].options.push({
        id: row.option_id,
        text: row.option_text,
      });
    });

    res.status(200).json(Object.values(formattedData));
  } catch (error) {
    console.error("Error fetching options by type:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a specific question with its options by ID
const getAssignedOptionsById = async (req, res) => {
  try {
    const { questionId } = req.params;
    if (!questionId) return res.status(400).json({ error: "Question ID is required" });

    const rows = await getQuestionWithOptionsById(questionId);
    if (rows.length === 0) return res.status(404).json({ message: "No options found for this question." });

    // Structuring response
    const formattedData = {
      survey_id: rows[0].survey_id,
      id: rows[0].question_id,
      text: rows[0].question_text,
      options: rows.map((row) => ({
        id: row.option_id,
        text: row.option_text,
      })),
    };

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching options by question ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getAssignedOptionsByType, getAssignedOptionsById };
