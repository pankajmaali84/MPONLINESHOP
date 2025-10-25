const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  applyForDomicileCertificate,
  getMyDomicileCertificates,
  updateMyDomicileCertificate,
  deleteMyDomicileCertificate,
} = require('../controller/domicileControllers');

router.post('/apply', protect, applyForDomicileCertificate);
router.get('/myAll', protect, getMyDomicileCertificates);
router.put('/:id', protect, updateMyDomicileCertificate);
router.delete('/:id', protect, deleteMyDomicileCertificate);

module.exports = router;
