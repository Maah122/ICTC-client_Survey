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
            const { office_code, office_name, services, personnel } = req.body;
    
            if (!office_code || !office_name) {
                return res.status(400).json({ message: "Office code and office name are required" });
            }
    
            // Insert office and get the new office ID
            const newOffice = await Office.createOffice(office_code, office_name);
            const officeId = newOffice.id;
    
            console.log("✅ Office created with ID:", officeId);
    
            // Insert services linked to the office
            const insertedServices = [];
            if (Array.isArray(services) && services.length > 0) {
                for (const service of services) {
                    const newService = await Office.createService(officeId, service);
                    insertedServices.push(newService);
                }
            }
    
            // Insert personnel linked to the office
            const insertedPersonnel = [];
            if (Array.isArray(personnel) && personnel.length > 0) {
                for (const person of personnel) {
                    const newPersonnel = await Office.createPersonnel(officeId, person);
                    insertedPersonnel.push(newPersonnel);
                }
            }
    
            res.status(201).json({
                message: "Office created successfully",
                office: {
                    id: officeId,
                    office_code: office_code,
                    office_name: office_name
                },
                services: insertedServices,
                personnel: insertedPersonnel
            });
    
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
        const { office_code, office_name, services, personnel } = req.body;
    
        try {
            // Validate inputs
            if (!office_code || !office_name) {
                return res.status(400).json({ 
                    success: false,
                    message: "Office code and office name are required" 
                });
            }
    
            // Check if the office exists
            const existingOffice = await Office.getOfficeById(officeId);
            if (!existingOffice) {
                return res.status(404).json({ 
                    success: false,
                    message: "Office not found" 
                });
            }
    
            // Update office in the database
            const updatedOffice = await Office.updateOffice(
                officeId, 
                office_code, 
                office_name, 
                services, 
                personnel
            );
            
            res.json({
                success: true,
                message: "Office updated successfully",
                data: updatedOffice
            });
        } catch (error) {
            console.error("❌ Error updating office:", error);
            res.status(500).json({ 
                success: false,
                message: error.message || "Error updating office" 
            });
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