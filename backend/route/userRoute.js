const express = require("express");
const router = express.Router();
const { addUser, getUsers, updateUser, deleteUser } = require("../controller/userController");

router.post("/adduser", addUser);
router.get("/users", getUsers);
router.put("/updateuser/:id", updateUser);   // Update user route
router.delete("/deleteuser/:id", deleteUser); // Delete user route

module.exports = router;
