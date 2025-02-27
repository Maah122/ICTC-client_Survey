const express = require("express");
const { storeSurveyResponse } = require("../controller/responseController");
const router = express.Router();

router.post("/responses/submit", storeSurveyResponse);

module.exports = router;
