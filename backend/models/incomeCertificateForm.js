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
    incomeAmount: {
      type: Number,
      required: true,
      min: 35000,
    },
    aadhar: {
      type: String,
      required: true,
      match: /^[0-9]{12}$/,
      index: true,
    },
    contactNumber: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },
    samagraId: {
      type: String,
      required: true,
      trim: true,
      match: /^[0-9]{8,9}$/,
      maxlength: 9,
      minlength: 8,
      index: true,
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
      enum: ['pending', 'received'],
      default: 'pending',
      index: true,
    },
    paymentReceivedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('IncomeCertificateForm', incomeCertificateFormSchema);
