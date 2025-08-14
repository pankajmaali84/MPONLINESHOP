const express = require('express');
const { getAllPanForms } = require('../controller/adminControllers');
const protect = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/isAdmin');

const router = express.Router();

// GET /api/admin/forms
router.get('/forms', protect, adminMiddleware, getAllPanForms);

module.exports = router;
