const express = require("express");
const AnswerController = require("../controller/answerController.js");

const router = express.Router();

// Route to get all answers for a specific survey
router.get("/answers/all/:surveyId", AnswerController.getAllAnswers);
router.get("/answers/:officeId/:surveyId", AnswerController.getByOfficeAndSurvey)


module.exports = router;