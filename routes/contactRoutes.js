const express = require("express");
const router = express.Router();
const { getContacts,
    createContact,
    updateContact,
    deleteContact,
    getSingleContact } = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");
const authRole = require("../middleware/validateRoleHandler");


router.use(validateToken);
router.route("/", authRole("admin")).get(getContacts).post(createContact);
router.route("/:id").put(updateContact).delete(deleteContact).get(getSingleContact);



module.exports = router;