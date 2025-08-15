const User = require("../models/User");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("name");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ name: user.name });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
