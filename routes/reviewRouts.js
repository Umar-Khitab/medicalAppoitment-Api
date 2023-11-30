const express = require('express');
const router = express.Router({mergeParams:true});
const {authenticate,restrict} = require('../auth/verifyToken')
const {getAllReviews, createReview} = require("../controllers/reviewController");

router.route("/").get(getAllReviews).post(authenticate,restrict(["patient"]),createReview)


module.exports = router;1