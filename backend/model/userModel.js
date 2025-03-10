const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

const createUser = async (userData) => {
  const { name, email, username, password, office, userRights } = userData;
  const query = `INSERT INTO "CSS".users (name, email, username, password, office, user_rights) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  const values = [name, email, username, password, office, userRights];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};


module.exports = { createUser, pool };
