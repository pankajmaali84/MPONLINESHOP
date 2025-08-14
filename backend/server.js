// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRouter');
// Load env vars
dotenv.config();

// Connect DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile',require('./routes/userProfileRoutes'))
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pan', require('./routes/panRoutes'));
app.use('/api/admin', require("./routes/adminRouter"));
app.use('/api/creatAdmin',require("./routes/creatAdminRouter"))


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
