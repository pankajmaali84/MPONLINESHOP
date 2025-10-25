const PropertyRegistrationForm = require('../models/propertyRegistrationForm');

exports.applyForPropertyRegistration = async (req, res) => {
  const {
    ownerName,
    ownerFatherName,
    ownerContactNumber,
    ownerEmail,
    ownerAadhar,
    ownerAddress,
    propertyType,
    propertyAddress,
    propertyDistrict,
    propertyState,
    propertyPincode,
    propertyArea,
    propertyAreaUnit,
    propertyValue,
    transactionType,
    buyerName,
    buyerContactNumber,
    previousOwnerName,
    khataNumber,
    khasraNumber,
    serviceTitle,
  } = req.body;

  if (!ownerName || !ownerFatherName || !ownerContactNumber || !ownerEmail || !ownerAadhar || !ownerAddress || !propertyType || !propertyAddress || !propertyDistrict || !propertyState || !propertyPincode || !propertyArea || !propertyAreaUnit || !propertyValue || !transactionType) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!/^[0-9]{12}$/.test(String(ownerAadhar))) {
    return res.status(400).json({ message: 'Aadhaar must be exactly 12 digits' });
  }

  if (!/^[0-9]{10}$/.test(String(ownerContactNumber))) {
    return res.status(400).json({ message: 'Mobile number must be exactly 10 digits' });
  }

  if (!/^[0-9]{6}$/.test(String(propertyPincode))) {
    return res.status(400).json({ message: 'Pincode must be exactly 6 digits' });
  }

  if (Number(propertyArea) < 1) {
    return res.status(400).json({ message: 'Property area must be greater than 0' });
  }

  if (Number(propertyValue) < 1) {
    return res.status(400).json({ message: 'Property value must be greater than 0' });
  }

  try {
    const form = await PropertyRegistrationForm.create({
      userId: req.user._id,
      serviceTitle: serviceTitle || 'Property Registration',
      ownerName,
      ownerFatherName,
      ownerContactNumber,
      ownerEmail,
      ownerAadhar,
      ownerAddress,
      propertyType,
      propertyAddress,
      propertyDistrict,
      propertyState,
      propertyPincode,
      propertyArea: Number(propertyArea),
      propertyAreaUnit,
      propertyValue: Number(propertyValue),
      transactionType,
      buyerName,
      buyerContactNumber,
      previousOwnerName,
      khataNumber,
      khasraNumber,
    });

    res.status(201).json({
      message: 'Property Registration form submitted successfully',
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

exports.getMyPropertyRegistrations = async (req, res) => {
  try {
    const forms = await PropertyRegistrationForm.find({ userId: req.user._id });
    res.status(200).json({ forms });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch forms', error: error.message });
  }
};

exports.updateMyPropertyRegistration = async (req, res) => {
  try {
    const form = await PropertyRegistrationForm.findOneAndUpdate(
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

exports.deleteMyPropertyRegistration = async (req, res) => {
  try {
    const form = await PropertyRegistrationForm.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.status(200).json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete form', error: error.message });
  }
};
