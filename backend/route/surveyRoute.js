const express = require("express");
const router = express.Router();
const surveyController = require("../controller/surveyController");


// Create a new survey
router.post("/surveys/create", surveyController.createSurvey);

// Get all surveys
router.get("/surveys", surveyController.getAllSurveys);

// Get a survey by ID
router.get("/surveys/:id", surveyController.getSurveyById);

router.put("/surveys/:id/status", surveyController.updateSurveyStatus);


module.exports = router;
