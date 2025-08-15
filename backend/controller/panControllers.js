
const PanCardForm = require('../models/panCardForm.js');

exports.applyForPanCard = async (req, res) => {
  const { name, parentName, dob,gender,contactNumber, email,aadhar,address } = req.body;

  try {
 
    const form = await PanCardForm.create({
      name,
      parentName,
      dob,
      gender,
      contactNumber,
      email,
      aadhar,
      address,
      userId: req.user._id
    });

    res.status(201).json({
      message: 'PAN form submitted successfully',
      form,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Form submission failed', error: error.message });
  }
};

exports.getMyPanForms = async (req, res) => {
  try {
    
    const forms = await PanCardForm.find({ userId: req.user._id });


    res.status(200).json({ forms }); 
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch forms', error: error.message });
  }
};

// update controller
exports.updateMyPanForm = async (req, res) => {
  try {
    const form = await PanCardForm.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.status(200).json({ message: 'Form updated', form });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update form', error: error.message });
  }
};


// delet controller

exports.deleteMyPanForm = async (req, res) => {
  try {
    const form = await PanCardForm.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.status(200).json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete form', error: error.message });
  }
};