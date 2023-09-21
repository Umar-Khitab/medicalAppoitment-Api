const mongoose = require("mongoose");

const userHasRolesSchema = mongoose.Schema(
    {

        role_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Role",
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },

    }, {
        timestamps: true
    });

module.exports = mongoose.model("UserHasRole", userHasRolesSchema);
