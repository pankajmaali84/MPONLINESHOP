// backend/routes/adminRouter.js या userRouter.js में जोड़ें

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/isAdmin');

// Make a user admin by email (admin-only)
router.put('/make-admin/:email', protect, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

      user.role = 'admin';
    await user.save();

    res.json({ message: `${user.name} is now an admin.` });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
});

module.exports = router;
