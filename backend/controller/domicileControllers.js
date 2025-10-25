const DomicileCertificateForm = require('../models/domicileCertificateForm');

exports.applyForDomicileCertificate = async (req, res) => {
  const {
    name,
    fatherName,
    motherName,
    dob,
    gender,
    contactNumber,
    email,
    aadhar,
    permanentAddress,
    currentAddress,
    district,
    state,
    pincode,
    yearsOfResidence,
    birthPlace,
    occupation,
    serviceTitle,
  } = req.body;

  if (!name || !fatherName || !motherName || !dob || !gender || !contactNumber || !email || !aadhar || !permanentAddress || !currentAddress || !district || !state || !pincode || !yearsOfResidence || !birthPlace) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!/^[0-9]{12}$/.test(String(aadhar))) {
    return res.status(400).json({ message: 'Aadhaar must be exactly 12 digits' });
  }

  if (!/^[0-9]{10}$/.test(String(contactNumber))) {
    return res.status(400).json({ message: 'Mobile number must be exactly 10 digits' });
  }

  if (!/^[0-9]{6}$/.test(String(pincode))) {
    return res.status(400).json({ message: 'Pincode must be exactly 6 digits' });
  }

  if (Number(yearsOfResidence) < 1) {
    return res.status(400).json({ message: 'Years of residence must be at least 1' });
  }

  try {
    const form = await DomicileCertificateForm.create({
      userId: req.user._id,
      serviceTitle: serviceTitle || 'Domicile Certificate',
      name,
      fatherName,
      motherName,
      dob,
      gender,
      contactNumber,
      email,
      aadhar,
      permanentAddress,
      currentAddress,
      district,
      state,
      pincode,
      yearsOfResidence: Number(yearsOfResidence),
      birthPlace,
      occupation,
    });

    res.status(201).json({
      message: 'Domicile Certificate form submitted successfully',
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

exports.getMyDomicileCertificates = async (req, res) => {
  try {
    const forms = await DomicileCertificateForm.find({ userId: req.user._id });
    res.status(200).json({ forms });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch forms', error: error.message });
  }
};

exports.updateMyDomicileCertificate = async (req, res) => {
  try {
    const form = await DomicileCertificateForm.findOneAndUpdate(
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

exports.deleteMyDomicileCertificate = async (req, res) => {
  try {
    const form = await DomicileCertificateForm.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.status(200).json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete form', error: error.message });
  }
};
