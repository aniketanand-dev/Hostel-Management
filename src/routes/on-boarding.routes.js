const express = require('express');
const router = express.Router();
const { createHostel, createSuperAdmin,
    createStudent,
    createStaff,
    getRoles,
    sendOtp,
    verifyOtp,
    login,
    sendForgetPasswordOtp,
    resetPassword,
    getHostelsForUser,
    getAllStudents,
    getStudentById,
    getAllStaff,
    getStaffById
} = require('./../controllers/on-boarding.controller');

const { getHome } = require('./../controllers/home.controller');

const { verifyToken } = require('./../middleware/auth.middleware');

// 1. Create Hostel
// Body: { hostelName, location, capacity }
router.post('/hostel', createHostel);

// 2. Create Super Admin for Hostel
// Body: { name, email, password, hostelId }
router.post('/superadmin', createSuperAdmin);

// 3. Create Student
// Body: { name, email, password, hostelId, role: 'Student' }
router.post('/student', createStudent);

// 4. Create Staff
// Body: { name, email, password, hostelId, role: 'Staff' }
router.post('/staff', createStaff);

// 5. Get all Roles
router.get('/roles', getRoles);

// 6. Send OTP for email verification
// Body: { email }
router.post('/otp/send', sendOtp);

// 7. Verify OTP
// Body: { email, otp }
router.post('/otp/verify', verifyOtp);

// 8. Login
// Body: { email, password }
router.post('/login', login);

router.post('/forget/password', sendForgetPasswordOtp);

router.post('/resetPassword', resetPassword);

router.use(verifyToken);

router.get('/hostels', getHostelsForUser);

router.get('/home', getHome);

router.get('/students', getAllStudents);
router.get('/students/:id', getStudentById);

router.get('/staff', getAllStaff);
router.get('/staff/:id', getStaffById);

module.exports = router;
