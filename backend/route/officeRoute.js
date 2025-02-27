const express = require("express");
const officeController = require("../controller/officeController");

const router = express.Router();

router.get("/offices", officeController.getAllOffices);
router.get("/offices/:officeId", officeController.getOfficeById);
router.get("/offices/:officeId/services", officeController.getServicesByOffice);
router.get("/offices/:officeId/personnel", officeController.getPersonnelByOffice);

module.exports = router;
