const IncomeCertificateForm = require('../models/incomeCertificateForm');

exports.applyForIncomeCertificate = async (req, res) => {
  const { name, parentName, incomeAmount, aadhar, contactNumber, samagraId, serviceTitle } = req.body;

  if (!name || !parentName || incomeAmount == null || !aadhar || !contactNumber || !samagraId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (Number(incomeAmount) < 35000) {
    return res.status(400).json({ message: 'Income amount must be at least 35000' });
  }

  if (!/^[0-9]{8,9}$/.test(String(samagraId))) {
    return res.status(400).json({ message: 'Samagra ID must be 8 to 9 digits' });
  }

  if (!/^[0-9]{12}$/.test(String(aadhar))) {
    return res.status(400).json({ message: 'Aadhaar must be exactly 12 digits' });
  }

  if (!/^[0-9]{10}$/.test(String(contactNumber))) {
    return res.status(400).json({ message: 'Mobile number must be exactly 10 digits' });
  }

  try {
    const form = await IncomeCertificateForm.create({
      userId: req.user._id,
      serviceTitle: serviceTitle || 'Income Certificate',
      name,
      parentName,
      incomeAmount: Number(incomeAmount),
      aadhar,
      contactNumber,
      samagraId,
    });

    res.status(201).json({
      message: 'Income Certificate form submitted successfully',
      form,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Form submission failed', error: error.message });
  }
};

exports.getMyIncomeCertificates = async (req, res) => {
  try {
    const forms = await IncomeCertificateForm.find({ userId: req.user._id });
    res.status(200).json({ forms });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch forms', error: error.message });
  }
};

exports.updateMyIncomeCertificate = async (req, res) => {
  try {
    const form = await IncomeCertificateForm.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.status(200).json({ message: 'Form updated', form });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update form', error: error.message });
  }
};

exports.deleteMyIncomeCertificate = async (req, res) => {
  try {
    const form = await IncomeCertificateForm.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.status(200).json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete form', error: error.message });
  }
};
