const express = require("express");
const router = express.Router();
const surveyController = require("../controller/surveyController");

router.post("/surveys/create", surveyController.createSurvey);
router.get("/surveys", surveyController.getAllSurveys);
router.get('/surveys/sections', surveyController.getAllSurveysWithSections);
router.get("/surveys/details", surveyController.getAllSurveysWithDetails);
router.get("/surveys/:id", surveyController.getSurveyById);
router.put("/surveys/:id/status", surveyController.updateSurveyStatus);
router.put("/surveys/update/:surveyId", surveyController.updateSurveyDetails);
router.delete("/surveys/delete/:surveyId", surveyController.deleteSurvey);



module.exports = router;