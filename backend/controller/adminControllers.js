const PanCardForm = require('../models/panCardForm');
const IncomeCertificateForm = require('../models/incomeCertificateForm');
const CasteCertificateForm = require('../models/casteCertificateForm');
const DomicileCertificateForm = require('../models/domicileCertificateForm');
const PropertyRegistrationForm = require('../models/propertyRegistrationForm');
const { sendEmail } = require('../utils/mailer');
const User = require('../models/User');

exports.getAllPanForms = async (req, res) => {
  try {
    const [panForms, incomeForms, casteForms, domicileForms, propertyForms] = await Promise.all([
      PanCardForm.find().populate('userId', 'name email'),
      IncomeCertificateForm.find().populate('userId', 'name email'),
      CasteCertificateForm.find().populate('userId', 'name email'),
      DomicileCertificateForm.find().populate('userId', 'name email'),
      PropertyRegistrationForm.find().populate('userId', 'name email'),
    ]);

    const normalize = (docs, type) =>
      docs.map((d) => ({
        _id: d._id,
        service: d.serviceTitle || type,
        applicantName: d.name || d.ownerName,
        contactNumber: d.contactNumber || d.ownerContactNumber || '',
        createdAt: d.createdAt,
        status: d.status,
        user: d.userId ? { name: d.userId.name, email: d.userId.email } : undefined,
        feeAmount: d.feeAmount || 0,
        paymentStatus: d.paymentStatus || '',
      }));

    const forms = [
      ...normalize(panForms, 'PAN Application'),
      ...normalize(incomeForms, 'Income Certificate'),
      ...normalize(casteForms, 'Caste Certificate'),
      ...normalize(domicileForms, 'Domicile Certificate'),
      ...normalize(propertyForms, 'Property Registration'),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ forms });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching forms', error: error.message });
  }
};

// PATCH /api/admin/forms/:id/status { status: string }
exports.updateFormStatus = async (req, res) => {
  const { id } = req.params;
  const { status, feeAmount, paymentStatus } = req.body || {};
  try {
    if (!status || typeof status !== 'string') return res.status(400).json({ message: 'Status is required' });

    // Try finding in all models
    let doc = await PanCardForm.findById(id);
    let model = 'PAN';
    if (!doc) {
      doc = await IncomeCertificateForm.findById(id);
      model = 'INCOME';
    }
    if (!doc) {
      doc = await CasteCertificateForm.findById(id);
      model = 'CASTE';
    }
    if (!doc) {
      doc = await DomicileCertificateForm.findById(id);
      model = 'DOMICILE';
    }
    if (!doc) {
      doc = await PropertyRegistrationForm.findById(id);
      model = 'PROPERTY';
    }
    if (!doc) return res.status(404).json({ message: 'Form not found' });

    doc.status = status;
    if (feeAmount !== undefined) {
      const amt = Number(feeAmount);
      if (!Number.isNaN(amt) && amt >= 0) doc.feeAmount = amt;
    }
    if (paymentStatus) {
      if (!['pending', 'received'].includes(paymentStatus)) {
        return res.status(400).json({ message: 'Invalid paymentStatus' });
      }
      doc.paymentStatus = paymentStatus;
      doc.paymentReceivedAt = paymentStatus === 'received' ? new Date() : undefined;
    }
    await doc.save();

    return res.json({ message: 'Status updated', id: doc._id, model, status: doc.status, feeAmount: doc.feeAmount, paymentStatus: doc.paymentStatus });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};

// GET /api/admin/forms/:id
exports.getFormById = async (req, res) => {
  const { id } = req.params;
  try {
    let form = await PanCardForm.findById(id).populate('userId', 'name email');
    let type = 'PAN';
    if (!form) {
      form = await IncomeCertificateForm.findById(id).populate('userId', 'name email');
      type = 'INCOME';
    }
    if (!form) {
      form = await CasteCertificateForm.findById(id).populate('userId', 'name email');
      type = 'CASTE';
    }
    if (!form) {
      form = await DomicileCertificateForm.findById(id).populate('userId', 'name email');
      type = 'DOMICILE';
    }
    if (!form) {
      form = await PropertyRegistrationForm.findById(id).populate('userId', 'name email');
      type = 'PROPERTY';
    }
    if (!form) return res.status(404).json({ message: 'Form not found' });

    // Normalize with detailed fields depending on type
    let details = {
      _id: form._id,
      type,
      service: form.serviceTitle || type,
      status: form.status,
      createdAt: form.createdAt,
      user: form.userId ? { name: form.userId.name, email: form.userId.email } : undefined,
    };

    if (type === 'PAN') {
      details = { ...details, name: form.name, parentName: form.parentName, motherName: form.motherName, dob: form.dob, gender: form.gender, contactNumber: form.contactNumber, email: form.email, aadhar: form.aadhar, address: form.address };
    } else if (type === 'INCOME') {
      details = { ...details, name: form.name, parentName: form.parentName, incomeAmount: form.incomeAmount, aadhar: form.aadhar, contactNumber: form.contactNumber, samagraId: form.samagraId, email: form.email, address: form.address };
    } else if (type === 'CASTE') {
      details = { ...details, name: form.name, fatherName: form.fatherName, motherName: form.motherName, dob: form.dob, gender: form.gender, category: form.category, subCaste: form.subCaste, contactNumber: form.contactNumber, email: form.email, aadhar: form.aadhar, address: form.address, district: form.district, state: form.state, pincode: form.pincode, rationCardNumber: form.rationCardNumber };
    } else if (type === 'DOMICILE') {
      details = { ...details, name: form.name, fatherName: form.fatherName, motherName: form.motherName, dob: form.dob, gender: form.gender, contactNumber: form.contactNumber, email: form.email, aadhar: form.aadhar, permanentAddress: form.permanentAddress, currentAddress: form.currentAddress, district: form.district, state: form.state, pincode: form.pincode, yearsOfResidence: form.yearsOfResidence, birthPlace: form.birthPlace, occupation: form.occupation };
    } else if (type === 'PROPERTY') {
      details = { ...details, ownerName: form.ownerName, ownerFatherName: form.ownerFatherName, ownerContactNumber: form.ownerContactNumber, ownerEmail: form.ownerEmail, ownerAadhar: form.ownerAadhar, ownerAddress: form.ownerAddress, propertyType: form.propertyType, propertyAddress: form.propertyAddress, propertyDistrict: form.propertyDistrict, propertyState: form.propertyState, propertyPincode: form.propertyPincode, propertyArea: form.propertyArea, propertyAreaUnit: form.propertyAreaUnit, propertyValue: form.propertyValue, transactionType: form.transactionType, buyerName: form.buyerName, buyerContactNumber: form.buyerContactNumber, previousOwnerName: form.previousOwnerName, khataNumber: form.khataNumber, khasraNumber: form.khasraNumber };
    }

    return res.json({ form: details });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch form', error: error.message });
  }
};

// GET /api/admin/users
// query: search, role, status (active|blocked), page, limit
exports.getUsers = async (req, res) => {
  try {
    const { search = '', role, status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (search) {
      const re = new RegExp(search, 'i');
      query.$or = [{ name: re }, { email: re }];
    }
    if (role) query.role = role;
    if (status === 'blocked') query.isBlocked = true;
    if (status === 'active') query.isBlocked = false;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));

    const [items, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      User.countDocuments(query),
    ]);

    res.json({ items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// PATCH /api/admin/users/:id/block
exports.blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User blocked', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to block user', error: err.message });
  }
};

// PATCH /api/admin/users/:id/unblock
exports.unblockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User unblocked', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to unblock user', error: err.message });
  }
};

// PATCH /api/admin/users/:id/role { role: 'user' | 'admin' }
exports.changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body || {};
    if (!['user', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Role updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update role', error: err.message });
  }
};

// GET /api/admin/stats/summary
exports.getStatsSummary = async (req, res) => {
  try {
    const [totalUsers, panCount, incomeCount, casteCount, domicileCount, propertyCount, blockedUsers] = await Promise.all([
      User.countDocuments({}),
      PanCardForm.countDocuments({}),
      IncomeCertificateForm.countDocuments({}),
      CasteCertificateForm.countDocuments({}),
      DomicileCertificateForm.countDocuments({}),
      PropertyRegistrationForm.countDocuments({}),
      User.countDocuments({ isBlocked: true }),
    ]);

    let pendingPan = 0, pendingIncome = 0, pendingCaste = 0, pendingDomicile = 0, pendingProperty = 0;
    let successPan = 0, successIncome = 0, successCaste = 0, successDomicile = 0, successProperty = 0;
    try {
      pendingPan = await PanCardForm.countDocuments({ status: /pending/i });
      pendingIncome = await IncomeCertificateForm.countDocuments({ status: /pending/i });
      pendingCaste = await CasteCertificateForm.countDocuments({ status: /pending/i });
      pendingDomicile = await DomicileCertificateForm.countDocuments({ status: /pending/i });
      pendingProperty = await PropertyRegistrationForm.countDocuments({ status: /pending/i });
      successPan = await PanCardForm.countDocuments({ status: /success|completed|done/i });
      successIncome = await IncomeCertificateForm.countDocuments({ status: /success|completed|done/i });
      successCaste = await CasteCertificateForm.countDocuments({ status: /success|completed|done/i });
      successDomicile = await DomicileCertificateForm.countDocuments({ status: /success|completed|done/i });
      successProperty = await PropertyRegistrationForm.countDocuments({ status: /success|completed|done/i });
    } catch (e) {}

    const totalRequests = panCount + incomeCount + casteCount + domicileCount + propertyCount;
    const pendingRequests = (pendingPan || 0) + (pendingIncome || 0) + (pendingCaste || 0) + (pendingDomicile || 0) + (pendingProperty || 0);
    const successCount = (successPan || 0) + (successIncome || 0) + (successCaste || 0) + (successDomicile || 0) + (successProperty || 0);

    // Revenue from payment fields
    const [panFees, incomeFees, casteFees, domicileFees, propertyFees] = await Promise.all([
      PanCardForm.find({ feeAmount: { $gt: 0 } }, { feeAmount: 1, paymentStatus: 1, serviceTitle: 1 }),
      IncomeCertificateForm.find({ feeAmount: { $gt: 0 } }, { feeAmount: 1, paymentStatus: 1, serviceTitle: 1 }),
      CasteCertificateForm.find({ feeAmount: { $gt: 0 } }, { feeAmount: 1, paymentStatus: 1, serviceTitle: 1 }),
      DomicileCertificateForm.find({ feeAmount: { $gt: 0 } }, { feeAmount: 1, paymentStatus: 1, serviceTitle: 1 }),
      PropertyRegistrationForm.find({ feeAmount: { $gt: 0 } }, { feeAmount: 1, paymentStatus: 1, serviceTitle: 1 }),
    ]);
    const allFees = [...panFees, ...incomeFees, ...casteFees, ...domicileFees, ...propertyFees];
    const revenueGross = allFees.filter(d => d.paymentStatus === 'received').reduce((s, d) => s + (d.feeAmount || 0), 0);
    const pendingValue = allFees.filter(d => d.paymentStatus === 'pending').reduce((s, d) => s + (d.feeAmount || 0), 0);

    // Top users with pending
    const [panPendingDocs, incomePendingDocs, castePendingDocs, domicilePendingDocs, propertyPendingDocs] = await Promise.all([
      PanCardForm.find({ status: /pending/i }, { userId: 1, name: 1, email: 1, serviceTitle: 1, feeAmount: 1 }).populate('userId', 'name email'),
      IncomeCertificateForm.find({ status: /pending/i }, { userId: 1, name: 1, email: 1, serviceTitle: 1, feeAmount: 1 }).populate('userId', 'name email'),
      CasteCertificateForm.find({ status: /pending/i }, { userId: 1, name: 1, email: 1, serviceTitle: 1, feeAmount: 1 }).populate('userId', 'name email'),
      DomicileCertificateForm.find({ status: /pending/i }, { userId: 1, name: 1, email: 1, serviceTitle: 1, feeAmount: 1 }).populate('userId', 'name email'),
      PropertyRegistrationForm.find({ status: /pending/i }, { userId: 1, name: 1, email: 1, serviceTitle: 1, feeAmount: 1 }).populate('userId', 'name email'),
    ]);

    const pendingByUserMap = new Map();
    const collectUserKey = (doc) => {
      const name = doc.userId?.name || doc.name || '';
      const email = doc.userId?.email || doc.email || '';
      const key = email || name;
      if (!key) return null;
      return { key, name: name || '(Unknown)', email };
    };
    [...panPendingDocs, ...incomePendingDocs, ...castePendingDocs, ...domicilePendingDocs, ...propertyPendingDocs].forEach((d) => {
      const info = collectUserKey(d);
      if (!info) return;
      const prev = pendingByUserMap.get(info.key) || { name: info.name, email: info.email, count: 0 };
      prev.count += 1;
      pendingByUserMap.set(info.key, prev);
    });
    const topPendingUsers = Array.from(pendingByUserMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json({
      totalUsers,
      totalRequests,
      pendingRequests,
      blockedUsers,
      totalOrders: totalRequests,
      totalRevenue: revenueGross,
      successCount,
      revenue: {
        gross: revenueGross,
        pendingValue,
        byService: {
          pan: {
            success: panFees.filter(d => d.paymentStatus === 'received').reduce((s, d) => s + (d.feeAmount || 0), 0),
            pending: panFees.filter(d => d.paymentStatus === 'pending').reduce((s, d) => s + (d.feeAmount || 0), 0),
          },
          income: {
            success: incomeFees.filter(d => d.paymentStatus === 'received').reduce((s, d) => s + (d.feeAmount || 0), 0),
            pending: incomeFees.filter(d => d.paymentStatus === 'pending').reduce((s, d) => s + (d.feeAmount || 0), 0),
          },
          caste: {
            success: casteFees.filter(d => d.paymentStatus === 'received').reduce((s, d) => s + (d.feeAmount || 0), 0),
            pending: casteFees.filter(d => d.paymentStatus === 'pending').reduce((s, d) => s + (d.feeAmount || 0), 0),
          },
          domicile: {
            success: domicileFees.filter(d => d.paymentStatus === 'received').reduce((s, d) => s + (d.feeAmount || 0), 0),
            pending: domicileFees.filter(d => d.paymentStatus === 'pending').reduce((s, d) => s + (d.feeAmount || 0), 0),
          },
          property: {
            success: propertyFees.filter(d => d.paymentStatus === 'received').reduce((s, d) => s + (d.feeAmount || 0), 0),
            pending: propertyFees.filter(d => d.paymentStatus === 'pending').reduce((s, d) => s + (d.feeAmount || 0), 0),
          },
        },
        currency: 'INR',
      },
      pending: {
        total: pendingRequests,
        byService: { pan: pendingPan, income: pendingIncome, caste: pendingCaste, domicile: pendingDomicile, property: pendingProperty },
        topUsers: topPendingUsers,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
};

// GET /api/admin/stats/today
exports.getTodayStats = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const [panToday, incomeToday] = await Promise.all([
      PanCardForm.find({ createdAt: { $gte: start, $lt: end } }, { serviceTitle: 1 }),
      IncomeCertificateForm.find({ createdAt: { $gte: start, $lt: end } }, { serviceTitle: 1 }),
    ]);

    const ordersToday = panToday.length + incomeToday.length;

    // Simple fee map (can be moved to config)
    const FEES = {
      'PAN Application': 200,
      'Income Certificate': 150,
    };

    const revenueToday = [...panToday, ...incomeToday].reduce((sum, d) => {
      const key = d.serviceTitle || 'PAN Application';
      return sum + (FEES[key] || 0);
    }, 0);

    res.json({
      date: start.toISOString(),
      ordersToday,
      revenueToday,
      breakdown: {
        pan: panToday.length,
        income: incomeToday.length,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch today stats', error: err.message });
  }
};

// POST /api/admin/forms/:id/notify
// Body: { type: 'tomorrow' | 'delay', customMessage? }
exports.sendNotification = async (req, res) => {
  const { id } = req.params;
  const { type, customMessage } = req.body || {};
  try {
    if (!type || !['tomorrow', 'delay'].includes(type)) {
      return res.status(400).json({ message: 'Invalid type. Use "tomorrow" or "delay"' });
    }

    // Try find in all models
    let form = await PanCardForm.findById(id).populate('userId', 'name email');
    let service = 'PAN Application';
    if (!form) {
      form = await IncomeCertificateForm.findById(id).populate('userId', 'name email');
      service = 'Income Certificate';
    }
    if (!form) {
      form = await CasteCertificateForm.findById(id).populate('userId', 'name email');
      service = 'Caste Certificate';
    }
    if (!form) {
      form = await DomicileCertificateForm.findById(id).populate('userId', 'name email');
      service = 'Domicile Certificate';
    }
    if (!form) {
      form = await PropertyRegistrationForm.findById(id).populate('userId', 'name email');
      service = 'Property Registration';
    }
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const toEmail = form.userId?.email || form.email || form.ownerEmail;
    const toName = form.userId?.name || form.name || form.ownerName || '';
    if (!toEmail) return res.status(400).json({ message: 'No recipient email available for this form' });

    let subject = 'Update on your request';
    let html = '';
    if (type === 'tomorrow') {
      subject = `Your ${service} will be done by tomorrow`;
      html = `<div style="font-family:Arial,sans-serif">
        <h2>Hello ${toName},</h2>
        <p>This is an update regarding your <strong>${service}</strong>.</p>
        <p>Your work will be completed by <strong>tomorrow</strong>.</p>
        <p>Thank you for your patience.</p>
      </div>`;
    } else {
      subject = `Sorry for the delay – ${service} ETA 1 to 3 days`;
      html = `<div style="font-family:Arial,sans-serif">
        <h2>Hello ${toName},</h2>
        <p>Sorry for the delay regarding your <strong>${service}</strong>.</p>
        <p>Your work will be completed within <strong>1 to 3 days</strong>.</p>
        <p>We appreciate your patience and understanding.</p>
      </div>`;
    }

    if (customMessage && String(customMessage).trim()) {
      html += `<div style="margin-top:12px;padding:12px;border-left:4px solid #3b82f6;background:#f1f5f9">
        <p style="margin:0;white-space:pre-line">${String(customMessage)}</p>
      </div>`;
    }

    await sendEmail(toEmail, subject, html);
    return res.json({ message: 'Notification email sent' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to send notification', error: error.message });
  }
};
