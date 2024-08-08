const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const User = require('./models/User');
const auth = require('./middleware/auth');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));
app.use(cors());
app.use(express.json());
app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/messageRoutes'));
app.use('/api', require('./routes/userRoutes'));


io.use(async (socket, next) => {                                                                                                                                                                                                                                                                                                                                                                                    
  try {
    const token = socket.handshake.query.token;
    const user = await auth.verifyToken(token);
    socket.user = user;
    socket.join(user.id);  // Join a room with the user's ID
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.id}`);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.id}`);
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});

module.exports = { io };
