const Doctor = require("../models/DoctorSchema");
const asyncHandler = require("express-async-handler");


// @desc Update Doctor Info
// @route PUT /api/users/:id
// @access private
const updateDoctor = asyncHandler(async (req, res) => {
    const id = await Doctor.findById(req.params.id);
       try {
          const updateUser = await Doctor.findByIdAndUpdate(id,{$set:req.body}, {new: true}).select("-password")
          res.status(200).json({success:true, message:"Doctor Successfully Updated", data:updateUser })
       } catch (error) {
          res.status(500).json({success:false, message:"Failed to Update,Try Again" })
       }
  });



// @desc Delete Doctor Info
// @route DELETE /api/v1/users/:id
// @access private

const deleteDoctor = asyncHandler(async (req, res) => {
  const id = await Doctor.findById(req.params.id);
   console.log(id)
     try {
          await Doctor.findByIdAndDelete(id)
        res.status(200).json({success:true, message:"Doctor Successfully Deleted"})
     } catch (error) {
        res.status(500).json({success:false, message:"Failed to Delete" })
     }
});

// @desc Get Single Doctor Info
// @route GET /api/v1/users/:id
// @access private

const getSingleDoctor = asyncHandler(async (req, res) => {
   const id = req.params.id;
   console.log("let see the request", id)
   try {
      const doctor = await Doctor.findById(id)
      .select("-password")
      .populate("reviews")
     
     if (!doctor) {
       return res.status(404).json({ success: false, message: "Doctor not found" });
     }
 
   } catch (error) {
     res.status(200).json({ success: true, message: "Doctor found", data: doctor });
     console.error(error); // Log the error for debugging
     res.status(500).json({ success: false, message: "Internal Server Error" });
   }
 });
 

// @desc Get All Doctor Info
// @route GET /api/v1/users/:id
// @access private

const getAllDoctors = asyncHandler(async (req, res) => {
       try {
             const {query} = req.query;
             let doctors;
          if(doctors){
            doctors = await Doctor.find({
                isApproved: "approved",
                $or: [
                    {name: {$regex: query, $options: 'i'}},
                    {specialization: {$regex: query, $options: 'i'}}
                ]
            }).select("-password")
          }else{
            doctors = await Doctor.find({isApproved: "approved"}).select("-password")
          }   
  
        //   const doctors = await Doctor.find({}).select('-password')
          res.status(200).json({success:true, message:"All Doctor", data:doctors })
       } catch (error) {
          res.status(500).json({success:false, message:"Failed to Get,Try Again" })
       }
  });
  module.exports = {
   
      updateDoctor,
      deleteDoctor,
    getAllDoctors,
    getSingleDoctor,
   
    };