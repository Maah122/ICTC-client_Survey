const pool = require("../db"); // Import PostgreSQL connection

const OfficeModel = {
    // Fetch all roles
    getRoles: async () => {
        const result = await pool.query('SELECT * FROM "CSS".role ORDER BY id');
        return result.rows;
    },

    // Fetch all colleges
    getColleges: async () => {
        const result = await pool.query('SELECT * FROM "CSS".college ORDER BY id');
        return result.rows;
    },

    // Fetch all regions
    getRegions: async () => {
        const result = await pool.query('SELECT * FROM "CSS".region ORDER BY id');
        return result.rows;
    }
};

module.exports = OfficeModel;
