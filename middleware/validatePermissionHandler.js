const asyncHandler = require("express-async-handler");
const UserHasRole = require("../models/userHasRoleModel");
const RoleHasPermission = require("../models/roleHasPermissionModel");



const hasPermissionTo = (permission) => {
    
    return async (req, res, next) => {
        const userId = req.user.id;
        const permissions = [permission];
        try {
            const hasRequiredPermissions = await checkUserPermission(userId, permissions);

            if (hasRequiredPermissions) {
                // User has the required permissions; proceed to the next middleware or route handler
                next();
            } else {
                // User doesn't have the required permissions; send a forbidden response
                res.status(403).json({ message: 'Permission denied' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}






const checkUserPermission = async (userId, permissions = []) => {


    const userRoles = await UserHasRole.find({ user_id: userId }).select("role_id -_id").populate("role_id");
    const roleIds = userRoles.map(userRole => userRole.role_id.id);
    // return roleIds;
    // Step 3: Retrieve the permission details
    const rolePermissions = await RoleHasPermission
        .find({ role_id: { $in: roleIds } })
        .select('permission_id')
        .populate('permission_id');

    const userPermissions = rolePermissions.map(rolePermission => rolePermission.permission_id.name);

    // Step 4: Check if the user has all the required permissions
    return permissions.every(permission => userPermissions.includes(permission));

}


module.exports = hasPermissionTo;