const express = require("express");
const errorHandlor = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const authRole = require("./middleware/validateRoleHandler");

connectDb();
const app = express();

const port = process.env.PORT || 5000;
app.use(express.json());

app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/roles", require("./routes/roleRoutes"));
app.use("/api/permissions", require("./routes/permissionRoutes"));
app.use(errorHandlor);

app.listen(port, () => {
    console.log("server is running");
}) 