const pool = require('../db'); // PostgreSQL connection

const Info = {
    // Get all offices
    getAllOffices: async () => {
        const result = await pool.query('SELECT * FROM "CSS".office');
        return result.rows;
    },

    // Get a specific office by ID
    getOfficeById: async (office_id) => {
        const result = await pool.query('SELECT * FROM "CSS".office WHERE id = $1', [office_id]);
        return result.rows[0]; // Return a single office
    },

    // Get services by office_id
    getServicesByOffice: async (office_id) => {
        const result = await pool.query('SELECT * FROM "CSS".service WHERE office_id = $1', [office_id]);
        return result.rows;
    },

    // Get personnel by office_id
    getPersonnelByOffice: async (office_id) => {
        const result = await pool.query('SELECT * FROM "CSS".personnel WHERE office_id = $1', [office_id]);
        return result.rows;
    }
};

module.exports = Info;
