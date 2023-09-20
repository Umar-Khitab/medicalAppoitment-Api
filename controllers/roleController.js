const asyncHandler = require("express-async-handler");
const Role = require("../models/roleModel");


// @desc Get all roles
// @route GET /api/roles/
// @access private

const getRoles = asyncHandler(async (req, res) => {
    try {
        const roles = await Role.find({ });
      

        res.status(200).json(
            {
                roles: roles
            });

    } catch (error) {
        // Handle the error and send an error response
        console.log(error);    }

}
);

// @desc Create New role
// @route POST /api/roles/
// @access private

const createRole = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { name } = req.body;
    if (!name ) {
        res.status(400);
        throw new Error("All fields are required");
    }
    const role = await Role.create({
        name,
    });

    res.status(201).json({ message: "Role created",
     role: role
     });

}
);

// @desc update role
// @route PUT /api/roles/:id
// @access private

const updateRole = asyncHandler(async (req, res) => {
    const role = await Role.findById(req.params.id);
    if (!role) {
        res.status(404);
        throw new Error("role Not Found");
    }
    const { name } = req.body;
    const data = {
        name,
    };
    const updatedRole = await Role.findByIdAndUpdate(req.params.id,
        data,
        { new: true });

    res.status(200).json({ message: `role updated `, role: updatedRole });


}
);

// @desc Get single role
// @route GET /api/roles/:id
// @access private

const getSingleRole = asyncHandler(async (req, res) => {
    const role = await Role.findById(req.params.id);
    if (!role) {
        res.status(404);
        throw new Error("role Not Found");
    }
    res.status(200).json({ role: role });


}
);


// @desc Get single role
// @route GET /api/roles/:id
// @access private

const deleteRole = asyncHandler(async (req, res) => {
    const role = await Role.findById(req.params.id);
    if (!role) {
        res.status(404);
        throw new Error("role Not Found");
    }
    const deleted = await Role.findByIdAndDelete(req.params.id);

    if(deleted){
        res.status(201).json({ message: "Role deleted Successfully" });

    }else{
        res.status(401).json({ message: "Role has failed to delete" });

    }


}
);

module.exports = { getRoles,createRole ,updateRole ,getSingleRole, deleteRole};