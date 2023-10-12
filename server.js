const express = require("express");
const http = require('http');
const socketIo = require('socket.io');
const errorHandlor = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const hasRole = require("./middleware/validateRoleHandler");
const hasPermissionTo = require("./middleware/validatePermissionHandler");
const validateToken = require("./middleware/validateTokenHandler");
const upload = require("./middleware/uploadFile");
const app = express();
// chat socket included
const server = http.createServer(app);
const configureSockets = require('./sockets/chatSocket'); // Replace with the actual path
configureSockets(server);
// 

connectDb();

const port = process.env.PORT || 5000;
app.use(express.json());



app.use('/login.css', express.static(__dirname + '/views/auth/login.css'));

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/auth/login.html');
});


app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/roles", require("./routes/roleRoutes"));
app.use("/api/permissions", require("./routes/permissionRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use(errorHandlor);
app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io/client-dist'));


// Define the route that you want to protect
app.get('/api/testing', validateToken, hasRole("admins"), (req, res) => {
    // This route is only accessible to users with the 'admin' role

    res.json({ message: 'Access granted to protected route' });
});

app.get('/api/file-upload', upload.any("file"), (req, res) => {
    // This route is only accessible to users with the 'admin' role

    res.json({ message: 'File Uploaded successfully' });
});

app.get('/messaging', (req, res) => {
    res.sendFile(__dirname + '/views/messages.html');
});

app.get('/individual-chat/:senderId/:reciverId', (req, res) => {
    res.sendFile(__dirname + '/views/individual_chat.html');
});


app.use(errorHandlor);

// Start the HTTP server
server.listen(port, () => {
    console.log("Server is running on port " + port);
});