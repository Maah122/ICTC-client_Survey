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
    }
};

module.exports = officeController;
