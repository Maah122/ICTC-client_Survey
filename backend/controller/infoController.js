const InfoModel = require("../model/infoModel");

const InfoController = {
    // Get all roles
    getRoles: async (req, res) => {
        try {
            const roles = await InfoModel.getRoles();
            res.json(roles);
        } catch (error) {
            console.error("Error fetching roles:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    // Get all colleges
    getColleges: async (req, res) => {
        try {
            const colleges = await InfoModel.getColleges();
            res.json(colleges);
        } catch (error) {
            console.error("Error fetching colleges:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    // Get all regions
    getRegions: async (req, res) => {
        try {
            const regions = await InfoModel.getRegions();
            res.json(regions);
        } catch (error) {
            console.error("Error fetching regions:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};

module.exports = InfoController;
