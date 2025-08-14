

const express = require('express');
const { applyForPanCard,getMyPanForms,updateMyPanForm, deleteMyPanForm} = require('../controller/panControllers');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/pan/apply
router.post('/apply', protect, applyForPanCard);
router.get('/myAllPan', protect, getMyPanForms); // Get user's PAN forms
router.put('/:id', protect, updateMyPanForm); // Update PAN form
router.delete('/:id', protect, deleteMyPanForm); // Delete PAN form

module.exports = router;

