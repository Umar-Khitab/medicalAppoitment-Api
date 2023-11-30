const asyncHandler = require("express-async-handler");
const User1 = require("../models/UserSchema");
const Doctor = require("../models/DoctorSchema")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const RevokeToken = require("../models/revokedTokenModel");
// const UserHasRole = require("../models/userHasRoleModel");
// const Role = require("../models/roleModel");
// const Permission = require("../models/permissionModel");
// const RoleHasPermission = require("../models/roleHasPermissionModel");
// const upload = require("../middleware/uploadFile");

// @desc Register a user
// @route POST /api/users/register
// @access public

const register = asyncHandler(async (req, res) => {
    try{
  const {email, password, name, role, photo,gender } = req.body;

  if (!email || !password || !name || !role) {
    res.status(404);
    throw new Error("All fields are required");
  }
  let user = null
    if(role === "patient"){
        user = await User1.findOne({ email });
    }else {
        user = await Doctor.findOne({ email });
    }

  if (user) {
    res.status(400);
    throw new Error("User1 already exist");
  }
  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);
  if (role === "patient") {
   user = new User1({
    name,
    email,
    password: hashedPassword,
    photo,
    gender,
    role,
  });
}
  if (role === "doctor") {
    user = new Doctor({
     name,
     email,
     password: hashedPassword,
     photo,
     gender,
     role,
   });
  }
  await user.save()

    res
      .status(200)
      .json({ success: true,  message: "user successfully created" });
    }catch(error){
        res
        .status(500)
        .json({ success: false,  message: "Internal server error, try agina." });
    }
});

// @desc Login a user
// @route POST /api/users/login
// @access public

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
  if (!email || !password) {
    res.status(404);
    throw new Error("All fields are required");
  }

  let user = null;
  const patient = await User1.findOne({ email });
  const doctor = await Doctor.findOne({ email });
  if(patient){
    user = patient
  }
  if(doctor){
    user = doctor
  }
  console.log(user)
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          id: user._id,
          role: user.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60m" }
    );
    res
    .status(200)
    .json({ success: true,  message: "user successfully created",accessToken,user});
//    return
  } else {
    res.status(401);
    throw new Error("Invalid Credantials");
  }
    
}catch(error){
    res
    .status(500)
    .json({ success: false,  message: "Internal server error, try agina." });
}


  
});



module.exports = {
    login,
    register
};
