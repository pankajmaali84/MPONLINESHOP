const express = require('express');
const {
  getAllPanForms,
  getFormById,
  sendNotification,
  updateFormStatus,
  getUsers,
  blockUser,
  unblockUser,
  changeUserRole,
  getStatsSummary,
  getTodayStats,
} = require('../controller/adminControllers');
const protect = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/isAdmin');

const router = express.Router();

// GET /api/admin/forms
router.get('/forms', protect, adminMiddleware, getAllPanForms);
// GET /api/admin/forms/:id
router.get('/forms/:id', protect, adminMiddleware, getFormById);
// PATCH /api/admin/forms/:id/status
router.patch('/forms/:id/status', protect, adminMiddleware, updateFormStatus);

// POST /api/admin/forms/:id/notify
router.post('/forms/:id/notify', protect, adminMiddleware, sendNotification);

// Users management
router.get('/users', protect, adminMiddleware, getUsers);
router.patch('/users/:id/block', protect, adminMiddleware, blockUser);
router.patch('/users/:id/unblock', protect, adminMiddleware, unblockUser);
router.patch('/users/:id/role', protect, adminMiddleware, changeUserRole);

// Stats
router.get('/stats/summary', protect, adminMiddleware, getStatsSummary);
router.get('/stats/today', protect, adminMiddleware, getTodayStats);

module.exports = router;
