const asyncHandler = require("express-async-handler");
const Role = require("../models/roleModel");
const Permission = require("../models/permissionModel");
const User = require("../models/userModel");
const RoleHasPermission = require("../models/roleHasPermissionModel");
const UserHasRole = require("../models/userHasRoleModel");


// @desc Assign Permissions to a Role
// @route Post /api/role-assign-permissions/
// @access private

const assignRoles = asyncHandler(async (req, res) => {
    try {
        const { userId, roles } = req.body;
        //  const roleId =  await getRoleId(role);

        await UserHasRole.deleteMany({ user_id: userId });

        var newRoles = roles.map(role => ({
            user_id: userId,
            role_id: role
        }));

        const insertroles = await UserHasRole.insertMany(newRoles);


        const userRoles = await UserHasRole.find({});

        res.status(200).json({ userHasRoles: userRoles });

    } catch (err) {
        console.log(err);
    }
});












const getRoleId = async (role) => {

    const roleObject = await Role.find({ name: role });

    return roleObject[0].id;

}

module.exports = { assignRoles };
