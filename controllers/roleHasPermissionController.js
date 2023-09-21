const asyncHandler = require("express-async-handler");
const Role = require("../models/roleModel");
const Permission = require("../models/permissionModel");
const RoleHasPermission = require("../models/roleHasPermissionModel");


// @desc Assign Permissions to a Role
// @route Post /api/role-assign-permissions/
// @access private

const assignPermissions = asyncHandler(async (req, res) => {
    try {
        const { role, permissions } = req.body;
        //  const roleId =  await getRoleId(role);

        await RoleHasPermission.deleteMany({ role_id: role });

        var newPermissions = permissions.map(permission => ({
            role_id: role,
            permission_id: permission
        }));

        const insertPermissions = await RoleHasPermission.insertMany(newPermissions);


        const rolesPermissions = await RoleHasPermission.find({ role_id: role }).populate("permission_id");

        res.status(200).json({ roleHasPermissions: rolesPermissions });

    } catch (err) {
        console.log(err);
    }
});

const getRoleId = async (role) => {

    const roleObject = await Role.find({ name: role });

    return roleObject[0].id;

}

module.exports = { assignPermissions };
