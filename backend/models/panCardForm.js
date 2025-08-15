
const mongoose = require('mongoose');

const panCardFormSchema =new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: String,
  parentName:String,
  dob: String,
  gender: String,
 contactNumber:String,
  aadhar: String,
  address: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PanCardForm', panCardFormSchema);
