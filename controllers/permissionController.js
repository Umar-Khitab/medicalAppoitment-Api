const asyncHandler = require("express-async-handler");
const Permission = require("../models/permissionModel");


// @desc Get all permissions
// @route GET /api/permissions/
// @access private

const getPermissions = asyncHandler(async (req, res) => {
    try {
        const permissions = await Permission.find({ });
      

        res.status(200).json(
            {
                permissions: permissions
            });

    } catch (error) {
        // Handle the error and send an error response
        console.log(error);    }

}
);

// @desc Create New Permission
// @route POST /api/permissions/create
// @access private

const createPermission = asyncHandler(async (req, res) => {

    console.log(req.body);
    const { name } = req.body;
    if (!name ) {
        res.status(400);
        throw new Error("All fields are required");
    }
    const permission = await Permission.create({
        name,
    });

    res.status(201).json({ message: "Permission created",
     permission: permission
     });
}
);

// @desc update permission
// @route PUT /api/permission/update/:id
// @access private

const updatePermission = asyncHandler(async (req, res) => {
    const permission = await Permission.findById(req.params.id);
    if (!permission) {
        res.status(404);
        throw new Error("Permission Not Found");
    }
    const { name } = req.body;
    const data = {
        name,
    };
    const updatedPermission = await Permission.findByIdAndUpdate(req.params.id,
        data,
        { new: true });

    res.status(200).json({ message: `permission updated `, permission: updatedPermission });



}
);

// @desc Get single permission
// @route GET /api/permissions/:id
// @access private

const getSinglePermission = asyncHandler(async (req, res) => {
    const permission = await Permission.findById(req.params.id);
    if (!permission) {
        res.status(404);
        throw new Error("permission Not Found");
    }
    res.status(200).json({ permission: permission });



}
);

// @desc delete Permission
// @route delete /api/permissions/:id
// @access private

const deletePermission = asyncHandler(async (req, res) => {
    const permission = await Permission.findById(req.params.id);
    if (!permission) {
        res.status(404);
        throw new Error("Permission Not Found");
    }
    const deleted = await Permission.findByIdAndDelete(req.params.id);

    if(deleted){
        res.status(201).json({ message: "Permission deleted Successfully" });

    }else{
        res.status(401).json({ message: "Permission has failed to delete" });

    }


}
);

module.exports = { getPermissions,createPermission ,updatePermission ,getSinglePermission, deletePermission};