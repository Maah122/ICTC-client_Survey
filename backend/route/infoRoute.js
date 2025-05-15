const express = require("express");
const router = express.Router();
const infoController = require("../controller/infoController");

// Define routes to fetch data
router.get("/infos/roles", infoController.getRoles);
router.get("/infos/colleges", infoController.getColleges);
router.get("/infos/regions", infoController.getRegions);

module.exports = router;
