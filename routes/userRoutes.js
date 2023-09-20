const express = require("express");
const { userRegister, loginUser,logoutUser, currentUser, allUsers } = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");
const authRole = require("../middleware/validateRoleHandler");
const router = express.Router();



router.post("/register", userRegister);

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/list", validateToken, authRole("admin"), allUsers);
router.get("/current", validateToken, currentUser);




module.exports = router;
