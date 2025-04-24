const express = require("express");
const officeController = require("../controller/officeController");

const router = express.Router();

// Office CRUD
router.get("/offices", officeController.getAllOffices);
router.get("/offices/:officeId", officeController.getOfficeById);
router.post("/offices", officeController.createOffice);
router.put("/offices/:officeId", officeController.updateOffice);
router.delete("/offices/:officeId", officeController.deleteOffice);

// Nested routes
router.get("/offices/:officeId/services", officeController.getServicesByOffice);
router.get("/offices/:officeId/personnel", officeController.getPersonnelByOffice);

// Service operations
router.post("/offices/:officeId/services", officeController.addService);
router.put("/offices/:officeId/services/:serviceId", officeController.updateService);

// Personnel operations
router.post("/offices/:officeId/personnel", officeController.addPersonnel);
router.put("/offices/:officeId/personnel/:personnelId", officeController.updatePersonnel);

module.exports = router;