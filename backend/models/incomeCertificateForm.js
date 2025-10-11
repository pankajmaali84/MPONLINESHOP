const mongoose = require('mongoose');

const incomeCertificateFormSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    serviceTitle: {
      type: String,
      default: 'Income Certificate',
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
    incomeAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    samagraId: {
      type: String,
      trim: true,
      maxlength: 50,
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

module.exports = mongoose.model('IncomeCertificateForm', incomeCertificateFormSchema);
