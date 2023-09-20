const asyncHandler = require("express-async-handler");


const authRole = (role) => {
    return (req, res, next) => {

        if(req.user.role !== role){
            res.status(401);
            throw new Error("User does not has the permission to access this!");
        }else{
            next();
        }
    }
};

module.exports = authRole;