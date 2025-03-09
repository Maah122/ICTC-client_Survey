const express = require("express");
const officeController = require("../controller/officeController");

const router = express.Router();

router.get("/offices", officeController.getAllOffices);
router.get("/offices/:officeId", officeController.getOfficeById);
router.get("/offices/:officeId/services", officeController.getServicesByOffice);
router.get("/offices/:officeId/personnel", officeController.getPersonnelByOffice);
router.post("/offices", officeController.createOffice);
router.delete("/offices/:officeId", officeController.deleteOffice);
router.put("/offices/:officeId", officeController.updateOffice);
router.put('/offices/:officeId/services/:serviceId', officeController.updateService);
router.put('/offices/:officeId/personnel/:personnelId', officeController.updatePersonnel);


module.exports = router;