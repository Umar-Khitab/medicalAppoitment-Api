const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Doctor = require('../models/DoctorSchema')
const User1 = require('../models/UserSchema')


const authenticate = asyncHandler(async (req, res, next) => {
    let authHeader = req.header.Authorization || req.headers.authorization;
    if (!authHeader && !authHeader.startsWith("Bearer ")) {
        res.status(401).json({success:false, message:"No token, authorization denied"});
    } 
    try {
        const token = authHeader.split(" ")[1];
        const {user} = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.userId = user.id
        req.role = user.role
        next();
    } catch (error) {
        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({message:"Token is expired"})
        }
        return res.status(401).json({message:"Invalid token"})
    }
    

});

const restrict = roles => asyncHandler(async (req,res,next) => {
    const userId = req.userId;

    let user;
    const patient = await User1.findById(userId);
    const doctor = await Doctor.findById(userId);

    if(patient){
       user = patient;
    }
    if(doctor){
      user = doctor;
    }
    if(!roles.includes(user.role)){
        console.log("let see",roles)
        return res.status(403).json({success: false,message: "You're not authorized"})
    }
    next();
})

module.exports = {authenticate,restrict}
