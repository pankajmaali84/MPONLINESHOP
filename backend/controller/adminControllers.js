const PanCardForm = require('../models/panCardForm');

exports.getAllPanForms = async (req, res) => {
  try {
    const forms = await PanCardForm.find().populate('user', 'name email');
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching forms', error: error.message });
  }
};
