const mongoose = require('mongoose');

const propertyRegistrationFormSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    serviceTitle: {
      type: String,
      default: 'Property Registration',
      trim: true,
    },
    // Owner Details
    ownerName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    ownerFatherName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    ownerContactNumber: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },
    ownerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    ownerAadhar: {
      type: String,
      required: true,
      match: /^[0-9]{12}$/,
      index: true,
    },
    ownerAddress: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    // Property Details
    propertyType: {
      type: String,
      required: true,
      enum: ['Residential', 'Commercial', 'Agricultural', 'Industrial'],
    },
    propertyAddress: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    propertyDistrict: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    propertyState: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    propertyPincode: {
      type: String,
      required: true,
      match: /^[0-9]{6}$/,
    },
    propertyArea: {
      type: Number,
      required: true,
      min: 1,
    },
    propertyAreaUnit: {
      type: String,
      required: true,
      enum: ['Sq Ft', 'Sq Meter', 'Acre', 'Hectare'],
    },
    propertyValue: {
      type: Number,
      required: true,
      min: 1,
    },
    // Transaction Details
    transactionType: {
      type: String,
      required: true,
      enum: ['Sale', 'Purchase', 'Gift', 'Lease', 'Inheritance'],
    },
    buyerName: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    buyerContactNumber: {
      type: String,
      match: /^[0-9]{10}$/,
    },
    previousOwnerName: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    khataNumber: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    khasraNumber: {
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

module.exports = mongoose.model('PropertyRegistrationForm', propertyRegistrationFormSchema);
