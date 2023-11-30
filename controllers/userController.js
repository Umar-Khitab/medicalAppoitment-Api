const User1 = require("../models/UserSchema");
const asyncHandler = require("express-async-handler");


// @desc Update User Info
// @route PUT /api/users/:id
// @access private
const updateUser = asyncHandler(async (req, res) => {
    const id = await User1.findById(req.params.id);
       try {
          const updateUser = await User1.findByIdAndUpdate(id,{$set:req.body}, {new: true}).select("-password")
          res.status(200).json({success:true, message:"User Successfully Updated", data:updateUser })
       } catch (error) {
          res.status(500).json({success:false, message:"Failed to Update,Try Again" })
       }
  });



// @desc Delete User Info
// @route DELETE /api/v1/users/:id
// @access private

const deleteUser = asyncHandler(async (req, res) => {
  const id = await User1.findById(req.params.id);
   console.log(id)
     try {
          await User1.findByIdAndDelete(id)
        res.status(200).json({success:true, message:"User Successfully Deleted"})
     } catch (error) {
        res.status(500).json({success:false, message:"Failed to Delete" })
     }
});

// @desc Get Single User Info
// @route GET /api/v1/users/:id
// @access private

const getSingleUser = asyncHandler(async (req, res) => {
    const id = await User1.findById(req.params.id).select("-password");
       try {
          const user = await User1.findByIdAndUpdate(id)
          if(!user){
            res.status(401).json({success:false, message:"Not Found user" })
          }
          res.status(200).json({success:true, message:"User Found", data:user })
       } catch (error) {
          res.status(500).json({success:false, message:"Internal Server Error" })
       }
  });


// @desc Get All User Info
// @route GET /api/v1/users/:id
// @access private

const getAllUsers = asyncHandler(async (req, res) => {
       try {
          const allUser = await User1.find({}).select('-password')
          res.status(200).json({success:true, message:"All Users", data:allUser })
       } catch (error) {
          res.status(500).json({success:false, message:"Failed to Update,Try Again" })
       }
  });
  module.exports = {
   
      updateUser,
      deleteUser,
    getAllUsers,
    getSingleUser,
   
    };