const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter user name!"]
    },
    email: {
        type: String,
        required: [true, "Please provide your email!"],
        unique: [true, "Email Already taken"]
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Role",
    },
    password: {
        type: String,
        required: [true, "Please provide your password!"],
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);