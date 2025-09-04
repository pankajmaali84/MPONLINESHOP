const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  applyForIncomeCertificate,
  getMyIncomeCertificates,
  updateMyIncomeCertificate,
  deleteMyIncomeCertificate,
} = require('../controller/incomeControllers');

// POST /api/income/apply
router.post('/apply', protect, applyForIncomeCertificate);
router.get('/myAll', protect, getMyIncomeCertificates);
router.put('/:id', protect, updateMyIncomeCertificate);
router.delete('/:id', protect, deleteMyIncomeCertificate);

module.exports = router;
