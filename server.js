const express = require("express");
const http = require('http');
const socketIo = require('socket.io');
const helmet = require("helmet");
const cors = require('cors')
const cookieParser = require("cookie-parser");
const errorHandlor = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const app = express();

app.use(
    helmet({
      crossOriginResourcePolicy: false,
    })
  );
// chat socket included
app.use(cors())
app.use(cookieParser())
app.use(express.json())
const server = http.createServer(app);
const configureSockets = require('./sockets/chatSocket'); // Replace with the actual path
configureSockets(server);
// 

connectDb();

const port = process.env.PORT || 5000;
app.use(express.json());


app.use("/api/v1/auth", require("./routes/authRouts"))

app.use(errorHandlor);

// Start the HTTP server
server.listen(port, () => {
    console.log("Server is running on port " + port);
});