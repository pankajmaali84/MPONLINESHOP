const express = require("express");
const router = express.Router();
const { getUserProfile, updateUserProfile } = require("../controller/userProfileController");
const protect = require("../middleware/authMiddleware");

router.get("/me", protect, getUserProfile);
router.put("/me", protect, updateUserProfile);

module.exports = router;
