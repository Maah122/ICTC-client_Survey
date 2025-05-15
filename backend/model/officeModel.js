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

    // ✅ Fix: Create office with correct fields
    createOffice: async (office_code, name) => {
        const result = await pool.query(
            'INSERT INTO "CSS".office (office_code, name) VALUES ($1, $2) RETURNING *',
            [office_code, name]
        );
        return result.rows[0];
    },

    deleteOffice: async (office_id) => {
        const result = await pool.query('DELETE FROM "CSS".office WHERE id = $1 RETURNING *', [office_id]);
        return result.rowCount > 0 ? result.rows[0] : null;
    },

    // ✅ Fix: Return newly created service
    createService: async (officeId, serviceName) => {
        const result = await pool.query(
            'INSERT INTO "CSS".service (office_id, name) VALUES ($1, $2) RETURNING *',
            [officeId, serviceName]
        );
        return result.rows[0];
    },

    // ✅ Fix: Return newly created personnel
    createPersonnel: async (officeId, personnelName) => {
        const result = await pool.query(
            'INSERT INTO "CSS".personnel (office_id, name) VALUES ($1, $2) RETURNING *',
            [officeId, personnelName]
        );
        return result.rows[0];
    },

    // ✅ Fix: Update office with correct fields
    updateOffice: async (officeId, office_code, name, services, personnel) => {
        const client = await pool.connect();
        try {
          await client.query("BEGIN");
      
          await client.query(
            'UPDATE "CSS".office SET office_code = $1, name = $2 WHERE id = $3',
            [office_code, name, officeId]
          );
      
          // Get existing service and personnel IDs
          const existingServicesResult = await client.query(
            'SELECT id FROM "CSS".service WHERE office_id = $1',
            [officeId]
          );
          const existingPersonnelResult = await client.query(
            'SELECT id FROM "CSS".personnel WHERE office_id = $1',
            [officeId]
          );
      
          const existingServiceIds = existingServicesResult.rows.map(row => row.id);
          const existingPersonnelIds = existingPersonnelResult.rows.map(row => row.id);
      
          // Delete removed services
          const newServiceIds = services.filter(s => s.id).map(s => s.id);
          const serviceIdsToDelete = existingServiceIds.filter(id => !newServiceIds.includes(id));
          if (serviceIdsToDelete.length > 0) {
            await client.query(
              `DELETE FROM "CSS".service WHERE id = ANY($1::int[]) AND office_id = $2`,
              [serviceIdsToDelete, officeId]
            );
          }
      
          // Upsert services
          for (const s of services || []) {
            if (s.id && existingServiceIds.includes(s.id)) {
              await client.query(
                'UPDATE "CSS".service SET name = $1, status = $2 WHERE id = $3 AND office_id = $4',
                [s.name, s.status, s.id, officeId]
              );
            } else {
              await client.query(
                'INSERT INTO "CSS".service (office_id, name, status) VALUES ($1, $2, $3)',
                [officeId, s.name, s.status]
              );
            }
          }
      
          // Delete removed personnel
          const newPersonnelIds = personnel.filter(p => p.id).map(p => p.id);
          const personnelIdsToDelete = existingPersonnelIds.filter(id => !newPersonnelIds.includes(id));
          if (personnelIdsToDelete.length > 0) {
            await client.query(
              `DELETE FROM "CSS".personnel WHERE id = ANY($1::int[]) AND office_id = $2`,
              [personnelIdsToDelete, officeId]
            );
          }
      
          // Upsert personnel
          for (const p of personnel || []) {
            if (p.id && existingPersonnelIds.includes(p.id)) {
              await client.query(
                'UPDATE "CSS".personnel SET name = $1, status = $2 WHERE id = $3 AND office_id = $4',
                [p.name, p.status, p.id, officeId]
              );
            } else {
              await client.query(
                'INSERT INTO "CSS".personnel (office_id, name, status) VALUES ($1, $2, $3)',
                [officeId, p.name, p.status]
              );
            }
          }
      
          await client.query("COMMIT");
      
          return {
            id: officeId,
            office_code,
            name,
            services,
            personnel
          };
        } catch (error) {
          await client.query("ROLLBACK");
          console.error("❌ Database Error:", error.stack);
          throw new Error(`Database update failed: ${error.message}`);
        } finally {
          client.release();
        }
      },
      
      
    

    // Add Services
    addService: async (officeId, serviceName) => {
        const query = 'INSERT INTO "CSS".service (office_id, name) VALUES ($1, $2) RETURNING *';
        const result = await pool.query(query, [officeId, serviceName]);
        return result.rows[0];
    },

    // Add Personnel
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

    updateOfficeStatus: async (officeId, status) => {
        const result = await pool.query(
            'UPDATE "CSS".office SET status = $1 WHERE id = $2 RETURNING *',
            [status, officeId]
        );
        return result.rows[0];
    },

    updateOfficeStatus: async (officeId, status) => {
        const result = await pool.query(
            'UPDATE "CSS".office SET status = $1 WHERE id = $2 RETURNING *',
            [status, officeId]
        );
        return result.rows[0];
    },
    
        // Add these methods to your Office model
    updateServiceStatus: async (officeId, serviceId, status) => {
        const result = await pool.query(
            'UPDATE "CSS".service SET status = $1 WHERE office_id = $2 AND id = $3 RETURNING *',
            [status, officeId, serviceId]
        );
        return result.rows[0];
    },

    updatePersonnelStatus: async (officeId, personnelId, status) => {
        const result = await pool.query(
            'UPDATE "CSS".personnel SET status = $1 WHERE office_id = $2 AND id = $3 RETURNING *',
            [status, officeId, personnelId]
        );
        return result.rows[0];
    },

    };

module.exports = Info;
