const mongoose = require("mongoose");

const permissionSchema = mongoose.Schema(
    {

        name: {
            type: String,
            require: [true, "Please provide permission name"]
        },

    }, {
        timestamps: true
    });

module.exports = mongoose.model("Permission", permissionSchema);
