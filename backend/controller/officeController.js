const Office = require("../model/officeModel");

const officeController = {
    // Get all offices
    getAllOffices: async (req, res) => {
        try {
            const offices = await Office.getAllOffices();
            res.json(offices);
        } catch (error) {
            res.status(500).json({ error: "Error fetching offices" });
        }
    },

    // Get a specific office by ID
    getOfficeById: async (req, res) => {
        const { officeId } = req.params;
        try {
            const office = await Office.getOfficeById(officeId);
            if (!office) {
                return res.status(404).json({ error: "Office not found" });
            }
            res.json(office);
        } catch (error) {
            res.status(500).json({ error: "Error fetching office details" });
        }
    },

    // Get services for a specific office
    getServicesByOffice: async (req, res) => {
        const { officeId } = req.params;
        try {
            const services = await Office.getServicesByOffice(officeId);
            res.json(services);
        } catch (error) {
            res.status(500).json({ error: "Error fetching services" });
        }
    },

    // Get personnel for a specific office
    getPersonnelByOffice: async (req, res) => {
        const { officeId } = req.params;
        try {
            const personnel = await Office.getPersonnelByOffice(officeId);
            res.json(personnel);
        } catch (error) {
            res.status(500).json({ error: "Error fetching personnel" });
        }
    },

    createOffice: async (req, res) => {
        try {
            const { office, services, personnel } = req.body;
    
            if (!office) {
                return res.status(400).json({ message: "Office name is required" });
            }
    
            // Insert office and get the new office ID
            const newOffice = await Office.createOffice(office);
            const officeId = newOffice.id;
    
            console.log("✅ Office created with ID:", officeId);
    
            // Insert services linked to the office
            if (services && services.length > 0) {
                for (const service of services) {
                    console.log("📌 Inserting service:", service);
                    await Office.createService(officeId, service);
                }
            } else {
                console.log("⚠️ No services provided.");
            }
    
            // Insert personnel linked to the office
            if (personnel && personnel.length > 0) {
                for (const person of personnel) {
                    console.log("📌 Inserting personnel:", person);
                    await Office.createPersonnel(officeId, person);
                }
            } else {
                console.log("⚠️ No personnel provided.");
            }
    
            res.status(201).json({ message: "Office created successfully", office: newOffice });
    
        } catch (error) {
            console.error("❌ Error creating office:", error);
            res.status(500).json({ message: "Server error" });
        }
    },
    

    deleteOffice: async (req, res) => {
        const { officeId } = req.params;
        try {
            const deletedOffice = await Office.deleteOffice(officeId);
            if (!deletedOffice) {
                return res.status(404).json({ error: "Office not found" });
            }
            res.json({ message: "Office deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: "Error deleting office" });
        }
    },

    addService: async (req, res) => {
        const { officeId } = req.params;
        const { serviceName } = req.body;

        try {
            if (!serviceName) {
                return res.status(400).json({ message: "Service name is required" });
            }

            const newService = await Office.addService(officeId, serviceName);
            res.status(201).json({ message: "Service added successfully", service: newService });
        } catch (error) {
            console.error("❌ Error adding service:", error);
            res.status(500).json({ message: "Error adding service" });
        }
    },

    addPersonnel: async (req, res) => {
        const { officeId } = req.params;
        const { personnelName } = req.body;

        try {
            if (!personnelName) {
                return res.status(400).json({ message: "Personnel name is required" });
            }

            const newPersonnel = await Office.addPersonnel(officeId, personnelName);
            res.status(201).json({ message: "Personnel added successfully", personnel: newPersonnel });
        } catch (error) {
            console.error("❌ Error adding personnel:", error);
            res.status(500).json({ message: "Error adding personnel" });
        }
    },

    updateOffice: async (req, res) => {
        const { officeId } = req.params;
        const { office, services, personnel } = req.body;
    
        try {
            // Check if the office exists
            const existingOffice = await Office.getOfficeById(officeId);
            if (!existingOffice) {
                return res.status(404).json({ message: "Office not found" });
            }
    
            // Update office name
            await Office.updateOfficeName(officeId, office);
    
            // Remove existing services and personnel before inserting new ones
            if (Array.isArray(services)) {
                await Office.deleteServicesByOffice(officeId);
                for (const service of services) {
                    await Office.createService(officeId, service);
                }
            }
    
            if (Array.isArray(personnel)) {
                await Office.deletePersonnelByOffice(officeId);
                for (const person of personnel) {
                    await Office.createPersonnel(officeId, person);
                }
            }
    
            res.json({ message: "Office updated successfully" });
        } catch (error) {
            console.error("❌ Error updating office:", error);
            res.status(500).json({ message: "Error updating office" });
        }
    },

    updateService: async (req, res) => {
        const { officeId, serviceId } = req.params;
        const { serviceName } = req.body;

        try {
            if (!serviceName) {
                return res.status(400).json({ message: "Service name is required" });
            }

            const updatedService = await Office.updateService(officeId, serviceId, serviceName);
            if (!updatedService) {
                return res.status(404).json({ message: "Service not found" });
            }

            res.json({ message: "Service updated successfully", service: updatedService });
        } catch (error) {
            console.error("❌ Error updating service:", error);
            res.status(500).json({ message: "Error updating service" });
        }
    },

    // Update personnel by ID
    updatePersonnel: async (req, res) => {
        const { officeId, personnelId } = req.params;
        const { personnelName } = req.body;

        try {
            if (!personnelName) {
                return res.status(400).json({ message: "Personnel name is required" });
            }

            const updatedPersonnel = await Office.updatePersonnel(officeId, personnelId, personnelName);
            if (!updatedPersonnel) {
                return res.status(404).json({ message: "Personnel not found" });
            }

            res.json({ message: "Personnel updated successfully", personnel: updatedPersonnel });
        } catch (error) {
            console.error("❌ Error updating personnel:", error);
            res.status(500).json({ message: "Error updating personnel" });
        }
    },
    
    
};




module.exports = officeController;