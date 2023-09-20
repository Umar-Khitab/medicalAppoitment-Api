const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const RevokeToken = require("../models/revokedTokenModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


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
    console.log(hashedPassword);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    if (user) {
        res.status(201).json({ _id: user.id, email: user.email });
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
// @desc Current User Info
// @route GET /api/users/current
// @access private

const currentUser = asyncHandler(async (req, res) => {
    res.json({ message: "logged in user", user: req.user });
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

module.exports = { userRegister, loginUser, logoutUser, currentUser, allUsers };