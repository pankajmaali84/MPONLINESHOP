// server.js (production-ready)
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect DB
connectDB();

const app = express();

// Middleware
const NODE_ENV = process.env.NODE_ENV || 'development';
const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(compression());
if (NODE_ENV !== 'test') {
  app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
}
app.use(express.json());
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile',require('./routes/userProfileRoutes'))
app.use('/api/pan', require('./routes/panRoutes'));
app.use('/api/admin', require("./routes/adminRouter"));
app.use('/api/creatAdmin',require("./routes/creatAdminRouter"))
app.use('/api/income', require('./routes/incomeRoutes'))

const PORT = process.env.PORT || 5000;
// Serve frontend in production (commented out for development)
// if (NODE_ENV === 'production') {
//   const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
//   app.use(express.static(frontendDist));
//   app.enable('strict routing');
//   // Handle client-side routing
//   app.get('*', (req, res) => {
//     // Don't serve index.html for API routes
//     if (req.path.startsWith('/api/')) {
//       return res.status(404).json({ message: 'API route not found' });
//     }
//     res.sendFile(path.resolve(frontendDist, 'index.html'));
//   });
// }




// Global error handler (basic)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running (${NODE_ENV}) on http://localhost:${PORT}`);
});
