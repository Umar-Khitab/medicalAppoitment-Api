const asyncHandler = require("express-async-handler");
const UserHasRole = require("../models/userHasRoleModel");


const hasRole = (paramRole) => {
    return async (req, res, next) => {

        try {
            const userId = req.user.id;
            let userRoles = await UserHasRole.find({ user_id: userId }).select(["role_id -_id"]).populate("role_id");
            let roleMatched = false;
            const roles = userRoles.map(userRole => userRole.role_id);
            roles.forEach(role => {
                console.log(role.name, paramRole);
                if (role.name == paramRole) {
                    roleMatched = true;
                    return;
                }
            });
            if (roleMatched) {
                next();
            } else {
                res.status(401).json({ message: "User is not authorized" });
                return;
            }
        } catch (err) {
            console.log(err);
        }
    }
};

module.exports = hasRole;