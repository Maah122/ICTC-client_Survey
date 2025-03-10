// controllers/userController.js
const { createUser, pool } = require("../model/userModel"); 

const addUser = async (req, res) => {
  const { name, email, username, password, office, userRights } = req.body;

  console.log("Received data:", req.body);

  if (!name || !email || !username || !password || !office || !userRights) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newUser = await createUser({ name, email, username, password, office, userRights });
    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add user" });
  }
};

const getUsers = async (req, res) => {
  try {
    const query = `SELECT id, office, name, email, user_rights AS rights FROM "CSS".users`;
    const result = await pool.query(query);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
// Update User
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, userRights } = req.body;

  try {
    const query = `UPDATE "CSS".users 
                   SET name = $1, email = $2, password = $3, user_rights = $4 
                   WHERE id = $5 RETURNING *`;

    const values = [name, email, password, userRights, id];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user: result.rows[0] });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};


// Delete User
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `DELETE FROM "CSS".users WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

module.exports = { addUser, getUsers, updateUser, deleteUser };