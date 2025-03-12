const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

const createUser = async (userData) => {
  const { name, email, username, password, userRights } = userData;
  const query = `INSERT INTO "CSS".users (name, email, username, password, user_rights) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const values = [name, email, username, password, userRights];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const findUserByUsername = async (username) => {
  const query = `SELECT * FROM "CSS".users WHERE username = $1`;
  const result = await pool.query(query, [username]);
  return result.rows[0];
};

const updateUser = async (userId, userData) => {
  const client = await pool.connect();

  const officeCodeMap = {
    "Accounting Division": "AD",
    "Alumni and Endowment Fund Center": "AEFC",
    "Cashiering Division": "CD",
    "CED - Integrated Development School": "CED-IDS",
    "Center for Advanced Education and Lifelong Learning": "CAELL",
    "Center for Information and Communication Technology": "CICT",
    "College of Education": "COE",
    "Hostel": "HSTL",
    "Human Resource Management Division": "HRMD",
    "Infrastructure Services Division": "ISD",
    "Knowledge and Technology Transfer Office": "KTTO",
    "Legal Services Office": "LSO",
    "MSU-IIT Center for Resiliency": "C4R",
    "Natural Science Museum": "NSM",
    "Office of Admissions, Scholarships and Grants": "OASG",
    "Office of Guidance and Counseling": "OGC",
    "Office of Medical, Dental and Health Services": "OMDHS",
    "Office of Monitoring and Evaluation": "OME",
    "Office of Sports Development": "OSD",
    "Office of Student Development Services": "OSDS",
    "Office of the Campus Secretary": "OCS",
    "Office of the University Registrar": "OUR",
    "Procurement Management Division": "PMD",
    "Security and Investigation Division": "SID",
    "Supply and Property Management Division": "SPMD",
    "University Library": "UL",
    "WE CARE Office": "WECARE"
  };

  try {
    await client.query('BEGIN');

    const { name, email, password, user_rights, offices } = userData;

    let officeCode = null;

    if (user_rights === 'Limited' && offices.length > 0) {
      const officeNamesRes = await client.query(
        `SELECT name FROM "CSS".office WHERE id = ANY($1::int[])`,
        [offices]
      );

      const officeCodes = officeNamesRes.rows
        .map(row => officeCodeMap[row.name])
        .filter(Boolean);

      officeCode = officeCodes.join(', ');
    }

    let updateUserQuery = `
      UPDATE "CSS".users 
      SET name = $1, email = $2, user_rights = $3
    `;
    const values = [name, email, user_rights];
    let paramIndex = 4;

    if (password && password.trim() !== "") {
      updateUserQuery += `, password = $${paramIndex++}`;
      values.push(password);
    }

    if (officeCode) {
      updateUserQuery += `, office = $${paramIndex++}`;
      values.push(officeCode);
    }

    updateUserQuery += ` WHERE id = $${paramIndex} RETURNING *`;
    values.push(userId);

    const userResult = await client.query(updateUserQuery, values);

    if (user_rights === 'Limited') {
      await client.query(`DELETE FROM "CSS".user_offices WHERE user_id = $1`, [userId]);

      for (const officeId of offices) {
        await client.query(
          `INSERT INTO "CSS".user_offices (user_id, office_id) VALUES ($1, $2)`,
          [userId, officeId]
        );
      }
    }

    await client.query('COMMIT');
    return userResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const updateUserRights = async (userId, user_rights, offices = []) => {
  const client = await pool.connect();

  const officeCodeMap = {
    "Accounting Division": "AD",
    "Alumni and Endowment Fund Center": "AEFC",
    "Cashiering Division": "CD",
    "CED - Integrated Development School": "CED-IDS",
    "Center for Advanced Education and Lifelong Learning": "CAELL",
    "Center for Information and Communication Technology": "CICT",
    "College of Education": "COE",
    "Hostel": "HSTL",
    "Human Resource Management Division": "HRMD",
    "Infrastructure Services Division": "ISD",
    "Knowledge and Technology Transfer Office": "KTTO",
    "Legal Services Office": "LSO",
    "MSU-IIT Center for Resiliency": "C4R",
    "Natural Science Museum": "NSM",
    "Office of Admissions, Scholarships and Grants": "OASG",
    "Office of Guidance and Counseling": "OGC",
    "Office of Medical, Dental and Health Services": "OMDHS",
    "Office of Monitoring and Evaluation": "OME",
    "Office of Sports Development": "OSD",
    "Office of Student Development Services": "OSDS",
    "Office of the Campus Secretary": "OCS",
    "Office of the University Registrar": "OUR",
    "Procurement Management Division": "PMD",
    "Security and Investigation Division": "SID",
    "Supply and Property Management Division": "SPMD",
    "University Library": "UL",
    "WE CARE Office": "WECARE"
  };

  try {
    await client.query('BEGIN');

    let officeCode = null;

    if (user_rights === 'Limited' && offices.length > 0) {
      const officeNamesRes = await client.query(
        `SELECT name FROM "CSS".office WHERE id = ANY($1::int[])`,
        [offices]
      );

      const officeCodes = officeNamesRes.rows
        .map(row => officeCodeMap[row.name])
        .filter(Boolean);

      officeCode = officeCodes.join(', ');
    }

    // Update user_rights (and office if Limited)
    const updateQuery = `
      UPDATE "CSS".users 
      SET user_rights = $1${officeCode ? ', office = $2' : ''}
      WHERE id = $${officeCode ? 3 : 2}
      RETURNING *;
    `;

    const values = officeCode ? [user_rights, officeCode, userId] : [user_rights, userId];

    const result = await client.query(updateQuery, values);

    if (user_rights === 'Limited') {
      await client.query(`DELETE FROM "CSS".user_offices WHERE user_id = $1`, [userId]);

      for (const officeId of offices) {
        await client.query(
          `INSERT INTO "CSS".user_offices (user_id, office_id) VALUES ($1, $2)`,
          [userId, officeId]
        );
      }
    }

    await client.query('COMMIT');
    return result.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};



module.exports = {
  createUser,
  findUserByUsername,
  updateUser,
  updateUserRights,
  pool,
};

