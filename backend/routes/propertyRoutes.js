const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  applyForPropertyRegistration,
  getMyPropertyRegistrations,
  updateMyPropertyRegistration,
  deleteMyPropertyRegistration,
} = require('../controller/propertyControllers');

router.post('/apply', protect, applyForPropertyRegistration);
router.get('/myAll', protect, getMyPropertyRegistrations);
router.put('/:id', protect, updateMyPropertyRegistration);
router.delete('/:id', protect, deleteMyPropertyRegistration);

module.exports = router;
