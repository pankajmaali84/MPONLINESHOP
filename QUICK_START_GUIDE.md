# Quick Start Guide - MP Online Shop Service Forms

## 🚀 Quick Deployment Steps

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Start the server (it should already have dependencies installed)
npm start
```

The backend will start on `http://localhost:5000`

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173` (or the port shown in terminal)

### 3. Verify Everything Works

#### Test New Services:
1. Open browser and go to `http://localhost:5173`
2. Login/Register as a user
3. Go to **Services** page
4. Click on any of these services:
   - ✅ PAN Card Application
   - ✅ Income Certificate
   - ✅ Caste Certificate (NEW)
   - ✅ Domicile Certificate (NEW)
   - ✅ Property Registration (NEW)

5. Fill the form and submit
6. Check "My Services" to see your application

#### Test Admin Panel:
1. Login as admin
2. Go to Admin Dashboard
3. You should see all applications from all 5 services
4. You can update status, add fees, mark payment received

## 📝 What's New?

### 3 New Service Forms Added:

1. **Caste Certificate (जाति प्रमाण पत्र)**
   - Required Fields: Name, Father/Mother Name, DOB, Gender, Category (SC/ST/OBC), Sub-Caste, Aadhar, Contact, Email, Address, District, State, Pincode
   - Optional: Ration Card Number

2. **Domicile Certificate (निवास प्रमाण पत्र)**
   - Required Fields: Name, Father/Mother Name, DOB, Gender, Birth Place, Aadhar, Contact, Email, Permanent Address, Current Address, District, State, Pincode, Years of Residence
   - Optional: Occupation

3. **Property Registration (संपत्ति पंजीकरण)**
   - Owner Details: Name, Father Name, Aadhar, Contact, Email, Address
   - Property Details: Type, Address, District, State, Pincode, Area, Unit, Value
   - Transaction Details: Type, Buyer Name, Previous Owner, Khata Number, Khasra Number

## 🎯 Key Features

### For Users:
- ✅ Single reusable form for all services
- ✅ Automatic form fields based on service type
- ✅ Real-time validation
- ✅ Edit/Delete applications
- ✅ Track application status

### For Admins:
- ✅ View all applications from all services
- ✅ Update status (submitted → in_review → approved → success)
- ✅ Set fees and track payments
- ✅ Send email notifications
- ✅ Comprehensive statistics

## 🔧 Technical Details

### API Endpoints Created:
- `/api/caste/*` - Caste Certificate operations
- `/api/domicile/*` - Domicile Certificate operations
- `/api/property/*` - Property Registration operations

### Database Collections:
MongoDB will automatically create these collections:
- `castecer
tificateforms`
- `domicilecertificateforms`
- `propertyregistrationforms`

## ⚠️ Important Notes

1. **MongoDB Required**: Make sure MongoDB is running
2. **Environment Variables**: Check `.env` files are properly configured
3. **CORS**: Frontend URL should be in backend CORS allowed origins

## 🐛 Troubleshooting

### Backend won't start?
```bash
cd backend
rm -rf node_modules
npm install
npm start
```

### Frontend won't start?
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Form not submitting?
- Check browser console for errors
- Verify backend is running on port 5000
- Check network tab for API call status
- Ensure all required fields are filled

### Admin not seeing new forms?
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache
- Check backend logs for errors

## 📦 Production Deployment

### Build Frontend:
```bash
cd frontend
npm run build
```

### Deploy Backend:
```bash
cd backend
# Set NODE_ENV=production in .env
npm start
```

### Environment Variables to Set:
```env
# Backend (.env)
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=your_frontend_url
PORT=5000

# Frontend (.env)
VITE_API_URL=your_backend_url
```

## ✅ Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts and loads Services page
- [ ] Can submit Caste Certificate form
- [ ] Can submit Domicile Certificate form
- [ ] Can submit Property Registration form
- [ ] Forms appear in "My Services"
- [ ] Can edit existing forms
- [ ] Can delete forms
- [ ] Admin sees all new applications
- [ ] Admin can update status
- [ ] Statistics show all services

## 🎉 Ready to Deploy!

Your application now has a complete, reusable form system for all government services. Simply start both backend and frontend, and everything should work seamlessly!

For detailed documentation, see: `SERVICE_FORMS_DOCUMENTATION.md`

---
**Need Help?** Check the console logs for detailed error messages.
