const express = require("express");
const router = express.Router();
const { addUser, getUsers, updateUserController, updateUserRightsController, deleteUser, login } = require("../controller/userController");

router.post("/adduser", addUser);   
router.get("/users", getUsers);
router.post('/login', login);
router.put("/update-user/:id", updateUserController);   // Update user route
router.put("/update-user-rights/:id", updateUserRightsController);
router.delete("/deleteuser/:id", deleteUser); // Delete user route

module.exports = router;
