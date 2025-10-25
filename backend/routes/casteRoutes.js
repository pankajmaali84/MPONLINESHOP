const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  applyForCasteCertificate,
  getMyCasteCertificates,
  updateMyCasteCertificate,
  deleteMyCasteCertificate,
} = require('../controller/casteControllers');

router.post('/apply', protect, applyForCasteCertificate);
router.get('/myAll', protect, getMyCasteCertificates);
router.put('/:id', protect, updateMyCasteCertificate);
router.delete('/:id', protect, deleteMyCasteCertificate);

module.exports = router;
