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

    router.get('/offices/active', officeController.getActiveOffice);
    router.put('/offices/:officeId/status', officeController.updateOfficeStatus);

    // Add these routes to your existing router
    router.put('/offices/:officeId/services/:serviceId/status', officeController.updateServiceStatus);
    router.put('/offices/:officeId/personnel/:personnelId/status', officeController.updatePersonnelStatus);


    module.exports = router;