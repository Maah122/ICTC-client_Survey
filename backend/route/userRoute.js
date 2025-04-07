const express = require("express");
const router = express.Router();
const { addUser, getUsers, updateUserController, updateUserRightsController, deleteUser, login } = require("../controller/userController");
const { authenticateToken, authorizeRole } = require("../middleware/auth");

// Public Route (No Authentication Needed)
router.post('/login', login);

// Protected Routes (Require Authentication)
router.use(authenticateToken); // Apply authentication middleware to all routes below

router.get("/users", authorizeRole(["Admin", "Doctor", "Staff"]), getUsers); // Admin sees all, Doctor & Staff see only their office
router.post("/adduser", authorizeRole(["Admin"]), addUser); // Only Admin can add users
router.put("/update-user/:id", authorizeRole(["Admin"]), updateUserController); // Only Admin can update users
router.put("/update-user-rights/:id", authorizeRole(["Admin"]), updateUserRightsController); // Only Admin can update user rights
router.delete("/deleteuser/:id", authorizeRole(["Admin"]), deleteUser); // Only Admin can delete users

module.exports = router;
