const express = require("express");
const { getResponsesBySurveyController, storeSurveyResponse, fetchResponsesByOfficeAndSurvey } = require("../controller/responseController");
const router = express.Router();

router.get("/responses/:id", storeSurveyResponse);
// Route to get all responses for a specific survey
router.get("/responses/all/:surveyId", getResponsesBySurveyController); // New route
router.post("/responses/submit", storeSurveyResponse);
// Route to fetch responses by officeId and surveyId
router.get("/responses/:officeId/:surveyId", fetchResponsesByOfficeAndSurvey);

module.exports = router;
