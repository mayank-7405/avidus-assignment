const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // Database import kiya

// .env file load karne ke liye
dotenv.config();

// Database connect karne ka function call kiya
connectDB();

// Express app initialize
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
// User Authentication ke routes
app.use('/api/auth', require('./routes/authRoutes'));

// Task Management ke routes
app.use('/api/tasks', require('./routes/taskRoutes'));
// Admin ke routes
app.use('/api/admin', require('./routes/adminRoutes'));
// Simple test route
app.get('/', (req, res) => {
    res.send('Bhai tera LevelUp API aur Database ekdum badhiya chal raha hai!');
});

// Server chalu karne ka code
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}`);
});