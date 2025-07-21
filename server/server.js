// backend/server.js - CORRECTED
const dotenv = require('dotenv');
// ** IMPORTANT: Configure dotenv at the VERY TOP **
dotenv.config();

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const connectDB = require('./config/db');
const { startSchedules } = require('./services/scheduler');
const Match = require('./models/Match');

// Now that dotenv is configured, we can connect to the database
connectDB();

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your React frontend URL
    methods: ["GET", "POST", "PUT"] // Add PUT method
  }
});

// Socket.io logic... (remains the same)
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinMatch', (matchId) => {
    socket.join(matchId);
    console.log(`User ${socket.id} joined room ${matchId}`);
  });

  socket.on('sendMessage', async ({ matchId, senderId, text }) => {
    try {
      const message = { sender: senderId, text, timestamp: new Date() };

      const updatedMatch = await Match.findByIdAndUpdate(
        matchId,
        { $push: { messages: message }, $inc: { messageCount: 1 } },
        { new: true }
      );
      
      socket.to(matchId).emit('receiveMessage', message);

      const timeDiff = new Date() - updatedMatch.createdAt;
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (updatedMatch.messageCount >= 100 && hoursDiff <= 48 && !updatedMatch.videoCallUnlocked) {
        await Match.findByIdAndUpdate(matchId, { videoCallUnlocked: true });
        io.in(matchId).emit('videoCallUnlocked');
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startSchedules();
});