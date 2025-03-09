const pool = require('../db'); // PostgreSQL connection

const Info = {
    // Get all offices
    getAllOffices: async () => {
        const officesResult = await pool.query('SELECT * FROM "CSS".office');
        const offices = officesResult.rows;
    
        for (let office of offices) {
            const servicesResult = await pool.query(
                'SELECT * FROM "CSS".service WHERE office_id = $1',
                [office.id]
            );
            office.services = servicesResult.rows;
    
            const personnelResult = await pool.query(
                'SELECT * FROM "CSS".personnel WHERE office_id = $1',
                [office.id]
            );
            office.personnel = personnelResult.rows;
        }
    
        return offices;
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
    },

    createOffice: async (name) => {
        const result = await pool.query(
            'INSERT INTO "CSS".office (name) VALUES ($1) RETURNING *',
            [name]
        );
        return result.rows[0];
    },

    deleteOffice: async (office_id) => {
        const result = await pool.query('DELETE FROM "CSS".office WHERE id = $1 RETURNING *', [office_id]);
        return result.rowCount > 0 ? result.rows[0] : null;
    },

    createService: async (officeId, serviceName) => {
        await pool.query(
            'INSERT INTO "CSS".service (office_id, name) VALUES ($1, $2)',
            [officeId, serviceName]
        );
    },

    createPersonnel: async (officeId, personnelName) => {
        await pool.query(
            'INSERT INTO "CSS".personnel (office_id, name) VALUES ($1, $2)',
            [officeId, personnelName]
        );
    },

    updateOffice: async (officeId, name, services, personnel) => {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Update office
            await client.query(
                'UPDATE "CSS".office SET name = $1 WHERE id = $2',
                [name, officeId]
            );

            // Insert new services
            for (const service of services || []) {
                await client.query(
                    'INSERT INTO "CSS".service (office_id, name) VALUES ($1, $2)',
                    [officeId, service]
                );
            }

            // Insert new personnel
            for (const person of personnel || []) {
                await client.query(
                    'INSERT INTO "CSS".personnel (office_id, name) VALUES ($1, $2)',
                    [officeId, person]
                );
            }

            await client.query("COMMIT");
            return { message: "Office updated successfully" };
        } catch (error) {
            await client.query("ROLLBACK");
            console.error("❌ Database Error:", error.stack);
            throw new Error(`Database update failed: ${error.message}`);
        } finally {
            client.release();
        }
    },

    // 🔥 New Function: Add Services
    addService: async (officeId, serviceName) => {
        const query = 'INSERT INTO "CSS".service (office_id, name) VALUES ($1, $2) RETURNING *';
        const result = await pool.query(query, [officeId, serviceName]);
        return result.rows[0];
    },

    // 🔥 New Function: Add Personnel
    addPersonnel: async (officeId, personnelName) => {
        const query = 'INSERT INTO "CSS".personnel (office_id, name) VALUES ($1, $2) RETURNING *';
        const result = await pool.query(query, [officeId, personnelName]);
        return result.rows[0];
    },

    updateService: async (officeId, serviceId, serviceName) => {
        const result = await pool.query(
            'UPDATE "CSS".service SET name = $1 WHERE office_id = $2 AND id = $3 RETURNING *',
            [serviceName, officeId, serviceId]
        );
        return result.rows[0]; // Return the updated service
    },

    // Update personnel by ID
    updatePersonnel: async (officeId, personnelId, personnelName) => {
        const result = await pool.query(
            'UPDATE "CSS".personnel SET name = $1 WHERE office_id = $2 AND id = $3 RETURNING *',
            [personnelName, officeId, personnelId]
        );
        return result.rows[0]; // Return the updated personnel
    },

    
};

module.exports = Info;