const mongoose = require("mongoose");

const roleSchema = mongoose.Schema(
    {

        name: {
            type: String,
            require: [true, "Please provide role name"]
        },

    }, {
        timestamps: true
    });

module.exports = mongoose.model("Role", roleSchema);
