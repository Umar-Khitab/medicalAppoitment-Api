const express = require("express");
const { userRegister, loginUser, logoutUser, currentUser, allUsers, getUserPermissions, getUserRoles } = require("../controllers/userController");
const { assignRoles } = require("../controllers/userHasRoleController");
const validateToken = require("../middleware/validateTokenHandler");
const hasRole = require("../middleware/validateRoleHandler");
const router = express.Router();



router.post("/register", userRegister);

router.post("/login", loginUser);
router.post("/logout", validateToken, logoutUser);
router.get("/roles/:id", validateToken, getUserRoles);
router.get("/permissions/:id", validateToken, getUserPermissions);
router.post("/assign-roles", validateToken, assignRoles);
router.get("/list", validateToken, hasRole("admin"), allUsers);
router.get("/current", validateToken, currentUser);





module.exports = router;
