const mongoose = require("mongoose");

const roleHasPermissionSchema = mongoose.Schema(
    {

        role_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Role",
        },
        permission_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Permission",
        },

    }, {
        timestamps: true
    });

module.exports = mongoose.model("RoleHasPermission", roleHasPermissionSchema);
