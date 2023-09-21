const express = require("express");
const errorHandlor = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const hasRole = require("./middleware/validateRoleHandler");
const hasPermissionTo = require("./middleware/validatePermissionHandler");
const validateToken = require("./middleware/validateTokenHandler");
const upload = require("./middleware/uploadFile");


connectDb();
const app = express();

const port = process.env.PORT || 5000;
app.use(express.json());

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/roles", require("./routes/roleRoutes"));
app.use("/api/permissions", require("./routes/permissionRoutes"));
app.use(errorHandlor);


// Define the route that you want to protect
app.get('/api/testing', validateToken, hasRole("admins"), (req, res) => {
    // This route is only accessible to users with the 'admin' role

    res.json({ message: 'Access granted to protected route' });
});

app.get('/api/file-upload', upload.any("file"), (req, res) => {
    // This route is only accessible to users with the 'admin' role

    res.json({ message: 'File Uploaded successfully' });
});

app.listen(port, () => {
    console.log("server is running");
}) 