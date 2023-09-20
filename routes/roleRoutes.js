const express = require("express");
const { getRoles, createRole, updateRole, getSingleRole, deleteRole} = require("../controllers/roleController");
const validateToken = require("../middleware/validateTokenHandler");
const authRole = require("../middleware/validateRoleHandler");
const router = express.Router();


router.use(validateToken);

router.route("/").get(getRoles).post(createRole);

router.route("/:id").put(updateRole).get(getSingleRole).delete(deleteRole);




module.exports = router;