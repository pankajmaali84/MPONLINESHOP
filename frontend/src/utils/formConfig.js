// Form configurations for all services
export const FORM_CONFIGS = {
  pan: {
    apiEndpoint: '/api/pan',
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter full name' },
      { name: 'parentName', label: "Father's Name", type: 'text', required: true, placeholder: "Enter father's name" },
      { name: 'motherName', label: "Mother's Name", type: 'text', required: false, placeholder: "Enter mother's name" },
      { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
      { name: 'gender', label: 'Gender', type: 'select', required: true, options: ['Male', 'Female', 'Other'] },
      { name: 'aadhar', label: 'Aadhar Number', type: 'text', required: true, placeholder: 'Enter 12-digit Aadhar', pattern: '^[0-9]{12}$', maxLength: 12 },
      { name: 'contactNumber', label: 'Mobile Number', type: 'tel', required: true, placeholder: 'Enter 10-digit mobile', pattern: '^[0-9]{10}$', maxLength: 10 },
      { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'Enter email address' },
      { name: 'address', label: 'Address', type: 'textarea', required: true, placeholder: 'Enter complete address', rows: 3 },
    ],
  },
  income: {
    apiEndpoint: '/api/income',
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter full name' },
      { name: 'parentName', label: "Father's Name", type: 'text', required: true, placeholder: "Enter father's name" },
      { name: 'incomeAmount', label: 'Annual Income (₹)', type: 'number', required: true, placeholder: 'Enter income (min 35000)', min: 35000 },
      { name: 'aadhar', label: 'Aadhar Number', type: 'text', required: true, placeholder: 'Enter 12-digit Aadhar', pattern: '^[0-9]{12}$', maxLength: 12 },
      { name: 'contactNumber', label: 'Mobile Number', type: 'tel', required: true, placeholder: 'Enter 10-digit mobile', pattern: '^[0-9]{10}$', maxLength: 10 },
      { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'Enter email address' },
      { name: 'address', label: 'Address', type: 'textarea', required: true, placeholder: 'Enter complete address', rows: 3 },
      { name: 'samagraId', label: 'Samagra ID', type: 'text', required: true, placeholder: 'Enter 8-9 digit Samagra ID', pattern: '^[0-9]{8,9}$', minLength: 8, maxLength: 9 },
    ],
  },
  caste: {
    apiEndpoint: '/api/caste',
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter full name' },
      { name: 'fatherName', label: "Father's Name", type: 'text', required: true, placeholder: "Enter father's name" },
      { name: 'motherName', label: "Mother's Name", type: 'text', required: true, placeholder: "Enter mother's name" },
      { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
      { name: 'gender', label: 'Gender', type: 'select', required: true, options: ['Male', 'Female', 'Other'] },
      { name: 'category', label: 'Category', type: 'select', required: true, options: ['SC', 'ST', 'OBC', 'General'] },
      { name: 'subCaste', label: 'Sub-Caste / Caste Name', type: 'text', required: true, placeholder: 'Enter your caste/sub-caste' },
      { name: 'aadhar', label: 'Aadhar Number', type: 'text', required: true, placeholder: 'Enter 12-digit Aadhar', pattern: '^[0-9]{12}$', maxLength: 12 },
      { name: 'contactNumber', label: 'Mobile Number', type: 'tel', required: true, placeholder: 'Enter 10-digit mobile', pattern: '^[0-9]{10}$', maxLength: 10 },
      { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'Enter email address' },
      { name: 'address', label: 'Address', type: 'textarea', required: true, placeholder: 'Enter complete address', rows: 2 },
      { name: 'district', label: 'District', type: 'text', required: true, placeholder: 'Enter district' },
      { name: 'state', label: 'State', type: 'text', required: true, placeholder: 'Enter state', value: 'Madhya Pradesh' },
      { name: 'pincode', label: 'Pincode', type: 'text', required: true, placeholder: 'Enter 6-digit pincode', pattern: '^[0-9]{6}$', maxLength: 6 },
      { name: 'rationCardNumber', label: 'Ration Card Number (Optional)', type: 'text', required: false, placeholder: 'Enter ration card number' },
    ],
  },
  domicile: {
    apiEndpoint: '/api/domicile',
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter full name' },
      { name: 'fatherName', label: "Father's Name", type: 'text', required: true, placeholder: "Enter father's name" },
      { name: 'motherName', label: "Mother's Name", type: 'text', required: true, placeholder: "Enter mother's name" },
      { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
      { name: 'gender', label: 'Gender', type: 'select', required: true, options: ['Male', 'Female', 'Other'] },
      { name: 'birthPlace', label: 'Place of Birth', type: 'text', required: true, placeholder: 'Enter birth place' },
      { name: 'aadhar', label: 'Aadhar Number', type: 'text', required: true, placeholder: 'Enter 12-digit Aadhar', pattern: '^[0-9]{12}$', maxLength: 12 },
      { name: 'contactNumber', label: 'Mobile Number', type: 'tel', required: true, placeholder: 'Enter 10-digit mobile', pattern: '^[0-9]{10}$', maxLength: 10 },
      { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'Enter email address' },
      { name: 'permanentAddress', label: 'Permanent Address', type: 'textarea', required: true, placeholder: 'Enter permanent address', rows: 2 },
      { name: 'currentAddress', label: 'Current Address', type: 'textarea', required: true, placeholder: 'Enter current address (same as permanent if applicable)', rows: 2 },
      { name: 'district', label: 'District', type: 'text', required: true, placeholder: 'Enter district' },
      { name: 'state', label: 'State', type: 'text', required: true, placeholder: 'Enter state', value: 'Madhya Pradesh' },
      { name: 'pincode', label: 'Pincode', type: 'text', required: true, placeholder: 'Enter 6-digit pincode', pattern: '^[0-9]{6}$', maxLength: 6 },
      { name: 'yearsOfResidence', label: 'Years of Residence', type: 'number', required: true, placeholder: 'Enter years lived', min: 1 },
      { name: 'occupation', label: 'Occupation (Optional)', type: 'text', required: false, placeholder: 'Enter occupation' },
    ],
  },
  property: {
    apiEndpoint: '/api/property',
    fields: [
      // Owner Details
      { name: 'ownerName', label: 'Owner Name', type: 'text', required: true, placeholder: "Enter owner's full name", section: 'Owner Details' },
      { name: 'ownerFatherName', label: "Owner's Father Name", type: 'text', required: true, placeholder: "Enter owner's father name", section: 'Owner Details' },
      { name: 'ownerAadhar', label: 'Owner Aadhar', type: 'text', required: true, placeholder: 'Enter 12-digit Aadhar', pattern: '^[0-9]{12}$', maxLength: 12, section: 'Owner Details' },
      { name: 'ownerContactNumber', label: 'Owner Mobile', type: 'tel', required: true, placeholder: 'Enter 10-digit mobile', pattern: '^[0-9]{10}$', maxLength: 10, section: 'Owner Details' },
      { name: 'ownerEmail', label: 'Owner Email', type: 'email', required: true, placeholder: 'Enter email address', section: 'Owner Details' },
      { name: 'ownerAddress', label: 'Owner Address', type: 'textarea', required: true, placeholder: 'Enter complete address', rows: 2, section: 'Owner Details' },
      
      // Property Details
      { name: 'propertyType', label: 'Property Type', type: 'select', required: true, options: ['Residential', 'Commercial', 'Agricultural', 'Industrial'], section: 'Property Details' },
      { name: 'propertyAddress', label: 'Property Address', type: 'textarea', required: true, placeholder: 'Enter property address', rows: 2, section: 'Property Details' },
      { name: 'propertyDistrict', label: 'District', type: 'text', required: true, placeholder: 'Enter district', section: 'Property Details' },
      { name: 'propertyState', label: 'State', type: 'text', required: true, placeholder: 'Enter state', value: 'Madhya Pradesh', section: 'Property Details' },
      { name: 'propertyPincode', label: 'Pincode', type: 'text', required: true, placeholder: 'Enter 6-digit pincode', pattern: '^[0-9]{6}$', maxLength: 6, section: 'Property Details' },
      { name: 'propertyArea', label: 'Property Area', type: 'number', required: true, placeholder: 'Enter area', min: 1, section: 'Property Details' },
      { name: 'propertyAreaUnit', label: 'Area Unit', type: 'select', required: true, options: ['Sq Ft', 'Sq Meter', 'Acre', 'Hectare'], section: 'Property Details' },
      { name: 'propertyValue', label: 'Property Value (₹)', type: 'number', required: true, placeholder: 'Enter property value', min: 1, section: 'Property Details' },
      
      // Transaction Details
      { name: 'transactionType', label: 'Transaction Type', type: 'select', required: true, options: ['Sale', 'Purchase', 'Gift', 'Lease', 'Inheritance'], section: 'Transaction Details' },
      { name: 'buyerName', label: 'Buyer Name (if applicable)', type: 'text', required: false, placeholder: 'Enter buyer name', section: 'Transaction Details' },
      { name: 'buyerContactNumber', label: 'Buyer Contact (Optional)', type: 'tel', required: false, placeholder: 'Enter 10-digit mobile', pattern: '^[0-9]{10}$', maxLength: 10, section: 'Transaction Details' },
      { name: 'previousOwnerName', label: 'Previous Owner (Optional)', type: 'text', required: false, placeholder: 'Enter previous owner name', section: 'Transaction Details' },
      { name: 'khataNumber', label: 'Khata Number (Optional)', type: 'text', required: false, placeholder: 'Enter Khata number', section: 'Transaction Details' },
      { name: 'khasraNumber', label: 'Khasra Number (Optional)', type: 'text', required: false, placeholder: 'Enter Khasra/Survey number', section: 'Transaction Details' },
    ],
  },
};

// Helper to get initial form state from config
export const getInitialFormState = (formType, editItem = null) => {
  const config = FORM_CONFIGS[formType];
  if (!config) return {};
  
  const initialState = {};
  config.fields.forEach(field => {
    if (editItem && editItem[field.name] !== undefined) {
      initialState[field.name] = editItem[field.name];
    } else {
      initialState[field.name] = field.value || (field.type === 'number' ? '' : '');
    }
  });
  
  return initialState;
};

// Validation helper
export const validateForm = (formType, formData) => {
  const config = FORM_CONFIGS[formType];
  if (!config) return false;
  
  for (const field of config.fields) {
    if (field.required && !formData[field.name]) {
      return false;
    }
    
    // Additional validation for specific types
    if (field.min !== undefined && formData[field.name] && Number(formData[field.name]) < field.min) {
      return false;
    }
    
    if (field.pattern && formData[field.name]) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(String(formData[field.name]))) {
        return false;
      }
    }
  }
  
  return true;
};
