const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const appConfig = require("./config/app.config");
const connectDB = require("./database/mongodb.database");
const { Server } = require("socket.io");
const http = require("http");



const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("./models/user.model.js");
require("./models/poll.model.js");
require("./models/vote.model.js");
require("./models/comment.model.js");

const authRoutes = require("./routes/auth.route.js");
const pollRoutes = require("./routes/poll.route.js");
const commentRoutes = require("./routes/comment.route.js");
const userRoutes = require("./routes/user.route.js");

app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);






const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // your frontend URL
    methods: ["GET", "POST"]
  }
});

global.io = io;

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinPoll', (pollId) => {
    socket.join(pollId);
    console.log(`Socket ${socket.id} joined poll ${pollId}`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const startServer = async () => {
  try {
    await connectDB(); 
    server.listen(appConfig.port, () => {
      console.log(`🚀 Server + Socket.IO running on port ${appConfig.port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1); 
  }
};

startServer();
