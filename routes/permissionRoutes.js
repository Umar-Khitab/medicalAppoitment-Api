const express = require("express");
const { getPermissions, createPermission, updatePermission, getSinglePermission, deletePermission} = require("../controllers/permissionController");
const validateToken = require("../middleware/validateTokenHandler");
const authRole = require("../middleware/validateRoleHandler");
const router = express.Router();


router.use(validateToken);

router.route("/").get(getPermissions).post(createPermission);

router.route("/:id").put(updatePermission).get(getSinglePermission).delete(deletePermission);




module.exports = router;
