require('dotenv').config();
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Order = require('./src/models/Order');
const userRoutes = require("./src/routes/userRoutes")
const orderRoutes = require("./src/routes/orderRoute")


const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', userRoutes)
app.use('/order', orderRoutes)
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Create HTTP server and WebSocket server
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Middleware for JWT authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Authentication error'));
    socket.user = decoded;
    next();
  });
});

// WebSocket event handlers
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.id}`);

  socket.on('placeOrder', async () => {
    const order = new Order({ userId: socket.user.id });
    await order.save();
    io.emit('orderUpdate', order);
  });

  socket.on('acceptOrder', async (orderId) => {
    const order = await Order.findByIdAndUpdate(orderId, { status: 'accepted' }, { new: true });
    io.emit('orderUpdate', order);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
