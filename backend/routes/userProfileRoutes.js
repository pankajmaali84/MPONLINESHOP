const express = require("express");
const router = express.Router();
const { getUserProfile } = require("../controller/userProfileController");
const protect = require("../middleware/authMiddleware");

router.get("/me", protect, getUserProfile); // 👈 secure route

module.exports = router;
