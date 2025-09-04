const User = require("../models/User");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("name email role createdAt");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const update = {};
    if (typeof name === 'string' && name.trim()) update.name = name.trim();
    if (typeof email === 'string' && email.trim()) update.email = email.trim().toLowerCase();

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    // Ensure email uniqueness if changed
    if (update.email) {
      const existing = await User.findOne({ email: update.email, _id: { $ne: req.user._id } });
      if (existing) {
        return res.status(409).json({ message: 'Email already in use' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: update },
      { new: true, runValidators: true, fields: 'name email role' }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
