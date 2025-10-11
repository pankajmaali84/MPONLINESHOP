const mongoose = require('mongoose');

const panCardFormSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    serviceTitle: {
      type: String,
      default: 'PAN Application',
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    parentName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    motherName: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    dob: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other'],
    },
    contactNumber: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    aadhar: {
      type: String,
      required: true,
      match: /^[0-9]{12}$/,
      index: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['submitted', 'in_review', 'approved', 'rejected', 'success'],
      default: 'submitted',
      index: true,
    },
    feeAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'received', ''],
      default: '',
      index: true,
    },
    paymentReceivedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PanCardForm', panCardFormSchema);
