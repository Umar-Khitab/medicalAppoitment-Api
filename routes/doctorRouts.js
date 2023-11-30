const express = require("express");
const { updateDoctor,deleteDoctor,getSingleDoctor,getAllDoctors} = require("../controllers/doctorController");
const { authenticate,restrict } = require("../auth/verifyToken");
const reviewRouter = require("../routes/reviewRouts");
const router = express.Router();

//nested route
router.use("/:doctorId/reviews",reviewRouter)

router.put("/:id",authenticate,restrict(["doctor"]), updateDoctor);
router.delete("/:id",authenticate, restrict(["doctor"]), deleteDoctor)
router.get("/:id",authenticate,restrict(["doctor"]), getSingleDoctor);
router.get("/",authenticate, getAllDoctors)






module.exports = router;
