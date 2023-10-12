const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const RevokeToken = require("../models/revokedTokenModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserHasRole = require("../models/userHasRoleModel");
const Role = require("../models/roleModel");
const Permission = require("../models/permissionModel");
const RoleHasPermission = require("../models/roleHasPermissionModel");
const upload = require("../middleware/uploadFile");

// @desc Register a user
// @route POST /api/users/register
// @access public

const userRegister = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(404);
        throw new Error("All fields are required");
    }
    const userAlreadyExist = await User.findOne({ email });

    if (userAlreadyExist) {
        res.status(400);
        throw new Error("User already exist");
    }
    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Extract the uploaded file path if it exists
    let profilePicturePath = null;
    if (req.files && req.files.length > 0) {
        profilePicturePath = req.files[0].path;

    }
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        profile_picture: profilePicturePath
    });

    if (user) {
        res.status(201).json({ _id: user.id, email: user.email, picture: user.profile_picture });
        return;
    }
    // res.json({ message: "register user" });
});

// @desc Login a user
// @route POST /api/users/login
// @access public

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(404);
        throw new Error("All fields are required");
    }

    const user = await User.findOne({ email });
    // compare password with hashed pass

    if (user && await bcrypt.compare(password, user.password)) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id,
                    role: user.role
                },

            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "60m" }
        )
        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("Invalid Credantials");
    }
});

// @desc logout a user
// @route GET /api/users/logout
// @access private

const logoutUser = asyncHandler(async (req, res) => {
    try {
        let authHeader = req.header.Authorization || req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1];
            const revokedToken = await RevokeToken.create({
                token: token
            });

            if (revokedToken) {
                res.status(201).json({ message: "user logged out successfully!" });
                return;
            } else {
                res.status(401).json({ message: "user logout failed!" });
                return;
            }
            if (!token) {
                res.status(401);
                throw new Error("Authorization Headers missing");

            }
        } else {
            res.status(401);
            throw new Error("User is not authorized");
        }


    } catch (err) {
        console.log(err);
    }

});


// @desc Update User Info
// @route PUT /api/users/:id
// @access private


const updateUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error("user Not Found");
    }
    const { username, email, password } = req.body;

    const userAlreadyExist = await User.findOne({ email: email, _id: { $ne: user.id } });


    if (userAlreadyExist) {
        res.status(400);
        throw new Error("User already exist");
    }

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
    }
    console.log(username);

    // Extract the uploaded file path if it exists
    // let profilePicturePath = null;
    // if (req.files && req.files.length > 0) {
    //     profilePicturePath = req.files[0].path;

    // }

    const data = {
        username: username,
        // email: email,
        // password: hashedPassword,
        // profile_picture: profilePicturePath
    };
    const updatedUser = await User.findByIdAndUpdate(req.params.id,
        data,
        { new: true });

    res.status(200).json({ message: `user updated `, user: updatedUser });


});






// @desc Current User Info
// @route GET /api/users/current
// @access private

const currentUser = asyncHandler(async (req, res) => {
    res.json({ message: "logged in user", user: req.user });
});


// @desc GET User Info
// @route GET /api/users/:id
// @access private

const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error("user Not Found");
    }
    res.status(200).json({user:{ username: user.username, email:user.email, id:user.id, role:user.role }});
});

// @desc get Users Roles
// @route get /api/users/roles/:id
// @access private

const getUserRoles = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id;
        let userRoles = await UserHasRole.find({ user_id: userId }).select(["role_id -_id"]).populate("role_id");

        const roles = userRoles.map(role => role.role_id);
        res.status(200).json({ roles });

    } catch (err) {
        console.log(err);
    }
});


// @desc Get User Permissions
// @route GET /api/users/permissions/:id
// @access private


const getUserPermissions = asyncHandler(async (req, res) => {
    const userId = req.params.id; // Assuming you have the user's ID available in req.user

    // Step 1: Retrieve the roles assigned to the user
    const userRoles = await UserHasRole.find({ user_id: userId }).select('role_id');

    // Step 2: Find the permissions associated with those roles
    const roleIds = userRoles.map(userRole => userRole.role_id);

    // res.status(200).json({ ids: roleIds});
    const rolePermissions = await RoleHasPermission
        .find({ role_id: { $in: roleIds } })
        .select('permission_id -_id') // Exclude _id field
        .populate('permission_id');

    const permissions = rolePermissions.map(rolePermission => rolePermission.permission_id);

    // Now 'permissions' contains the list of permissions associated with the user's roles
    res.status(200).json({ permissions });

});



// @desc all users Info
// @route GET /api/users/current
// @access private

const allUsers = asyncHandler(async (req, res) => {
    try {

        const users = await User.find({}).select(["username", "email"]);

        res.status(200).json({ users: users });

    } catch (err) {
        console.log(err);
    }
});

module.exports = { userRegister, loginUser, logoutUser, currentUser, allUsers, getUserPermissions, getUserRoles, updateUser, getUser };