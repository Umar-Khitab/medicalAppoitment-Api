const Review = require('../models/ReviewSchema');
const Doctor = require("../models/DoctorSchema");
const asyncHandler = require("express-async-handler");


// @desc Get All Reviews Info
// @route GET /api/v1/*/:id
// @access private

const getAllReviews = asyncHandler(async (req, res) => {
    try {
          
      
        const reviews = await Review.find({})

     //   const doctors = await Doctor.find({}).select('-password')
       res.status(200).json({success:true, message:"All Doctor", data:reviews })
    } catch (error) {
       res.status(404).json({success:false, message:"Not found" })
    }
});


// @desc Create Review Info
// @route PUT /api/review/:id
// @access private
const createReview = asyncHandler(async (req, res) => {
      if(!req.body.doctory) req.body.doctor = req.params.doctorId
      if(!req.body.user) req.body.user = req.userId;
   
    const newReview = new Review(req.body);
       try {
          const savedReview = await newReview.save();
          await Doctor.findByIdAndUpdate(req.body.doctor,{
            $push: {reviews: savedReview._id}
          })
          res.status(200).json({success:true, message:"Review Submitted", data:savedReview })
       } catch (error) {
          res.status(500).json({success:false, message:error.message })
       }

  });


  module.exports = {
      getAllReviews,
      createReview,
    };