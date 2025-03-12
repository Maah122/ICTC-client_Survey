const AnswerModel = require("../model/answerModel.js");

const AnswerController = {
  getAllAnswers: async (req, res) => {
    const { surveyId } = req.params;
    try {
      const answers = await AnswerModel.getAnswersBySurvey(surveyId);
      res.status(200).json(answers);
    } catch (error) {
      console.error("Error fetching answers:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getByOfficeAndSurvey: async (req, res) => {
    const { officeId, surveyId } = req.params;
  
    try {
      const answers = await AnswerModel.getAnswersByOfficeAndSurvey(officeId, surveyId);
      res.json(answers);
    } catch (err) {
      console.error("Error fetching answers by office and survey:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

module.exports = AnswerController;
