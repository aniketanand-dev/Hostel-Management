const express = require('express');
const router = express.Router();
const { createHostelWithSuperAdmin,
    createUser,
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

const { practice } = require('./../controllers/test.controller')

const { verifyToken } = require('./../middleware/auth.middleware');

// 1. Create Hostel with admin
// Body: {
//    "hostelName": "Green Hostel",
//    "location": "City Center",
//    "capacity": 150,
//    "admin": {
//        "name": "Admin User",
//        "email": "admin@example.com",
//        "password": "securepassword"
//    }
//}
router.post('/hostel', createHostelWithSuperAdmin);


// 3. Create User
//Body: {
//    "name": "John Doe",
//    "email": "john@example.com",
//    "password": "password123",
//    "hostelId": 1,
//    "roleName": "STUDENT"
//}


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
router.post('/user', createUser);

router.get('/hostels', getHostelsForUser);

router.get('/home', getHome);

router.get('/students', getAllStudents);
router.get('/students/:id', getStudentById);

router.get('/staff', getAllStaff);
router.get('/staff/:id', getStaffById);

router.post('/test', practice)

module.exports = router;
