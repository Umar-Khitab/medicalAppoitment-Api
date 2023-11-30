const express = require("express");
const { updateUser,deleteUser,getSingleUser,getAllUsers} = require("../controllers/userController");
const {authenticate,restrict}= require("../auth/verifyToken");
const router = express.Router();

router.get("/", authenticate,restrict(["admin"]),getAllUsers)
router.get("/:id",authenticate,restrict(["patient"]), getSingleUser);
router.put("/:id",authenticate,restrict(["patient"]) , updateUser);
router.delete("/:id",authenticate,restrict(["patient"]) , deleteUser)






module.exports = router;
