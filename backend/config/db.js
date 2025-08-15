
const mongoose = require('mongoose');


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected ✅');
  } catch (err) {
<<<<<<< HEAD
    console.log('MongoDB connection error:', err.message);
=======
    console.error('MongoDB connection error:', err.message);
>>>>>>> c3540197e2bbe8cac0011fc08b3e5e83b82e2c2b
    process.exit(1);
  }
};

module.exports = connectDB;
