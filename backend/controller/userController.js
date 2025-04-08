// controllers/userController.js
const jwt = require('jsonwebtoken');
const { createUser, pool, findUserByUsername, updateUser, updateUserRights } = require("../model/userModel"); 
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use env in production

const addUser = async (req, res) => {
  const { name, email, username, password, userRights } = req.body;

  console.log("Received data:", req.body);

  if (!name || !email || !username || !password || !userRights) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newUser = await createUser({ name, email, username, password, userRights });
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

const updateUserController = async (req, res) => {
  const userId = req.params.id;
  const { name, email, password, user_rights, offices } = req.body;

  console.log("Update request payload:", req.body);

  try {
    const updatedUser = await updateUser(userId, {
      name,
      email,
      password,
      user_rights,
      offices,
    });

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

const updateUserRightsController = async (req, res) => {
  const userId = req.params.id;
  const {user_rights, offices } = req.body;

  console.log("Update request payload:", req.body);

  try {
    const updatedUser = await updateUserRights(userId, {
      user_rights,
      offices,
    });

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update user' });
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

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await findUserByUsername(username);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare plaintext password (use bcrypt in production!)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Create JWT payload
    const payload = {
      id: user.id,
      username: user.username,
      user_rights: user.user_rights,
      office: user.office
    };

    // Sign token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });

    // Send token and user info
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        office: user.office,
        user_rights: user.user_rights
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { addUser, getUsers, updateUserController, updateUserRightsController, deleteUser, login};