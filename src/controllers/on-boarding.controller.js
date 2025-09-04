const onboardingService = require('./../services/on-boarding.service');
const { User, Role, HostelUserRoleMapping} = require('../../models');

exports.createHostel = async (req, res) => {
    try {
        const hostel = await onboardingService.createHostel(req.body);
        res.status(201).json(hostel);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createSuperAdmin = async (req, res) => {
    try {
        const user = await onboardingService.createUserWithRole({ ...req.body, roleName: 'SUPER_ADMIN' });
        res.status(201).json({ user, message: 'Super Admin created' });
    } catch (err) {
        console.log(err);

        res.status(500).json({ error: err.message });
    }
};

exports.createStudent = async (req, res) => {
    try {
        const user = await onboardingService.createUserWithRole({ ...req.body, roleName: 'STUDENT' });
        res.status(201).json({ user, message: 'Student created' });
    } catch (err) {
        console.log(err);

        res.status(500).json({ error: err.message });
    }
};

exports.createStaff = async (req, res) => {
    try {
        const user = await onboardingService.createUserWithRole({ ...req.body, roleName: 'STAFF' });
        res.status(201).json({ user, message: 'Staff created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getRoles = async (req, res) => {
    try {
        const roles = await onboardingService.getRoles();
        res.status(200).json(roles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.sendOtp = async (req, res) => {
    try {
        await onboardingService.sendOtpToEmail(req.body.email);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err) {
        console.log(err);

        res.status(500).json({ error: err.message });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        await onboardingService.verifyOtp(req.body.email, req.body.otp);
        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await onboardingService.loginUser({ email, password });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                //user: result.user,
                token: result.token,
                roles: result.roles
            }
        });
    } catch (err) {
        if (err.message.includes('Password not updated')) {
            return res.status(400).json({
                success: false,
                message: err.message,
                passwordUpdate: false
            });
        }

        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};



exports.sendForgetPasswordOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await onboardingService.sendForgetPasswordOtp(email);

        res.status(200).json({ success: true, message: result.message });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;

        if (!otp) {
            return res.status(400).json({ success: false, message: "OTP is required" });
        }

        if (!newPassword || !confirmPassword) {
            return res.status(400).json({ success: false, message: "Both password fields are required" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        const result = await onboardingService.resetPassword(email, otp, newPassword);

        res.status(200).json({ success: true, message: result.message });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};


exports.getHostelsForUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const hostels = await onboardingService.getHostelsForUser(userId);

        res.status(200).json({
            success: true,
            data: hostels
        });
    } catch (err) {
        console.log(err);

        res.status(400).json({ success: false, message: err.message });
    }
};


exports.getAllStudents = async (req, res) => {
    try {
        const { hId } = req.query;

        const students = await HostelUserRoleMapping.findAll({
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Role, attributes: ['id', 'name'] }
            ],
            where: { 
                roleId: 5, // student role
                ...(hId && { hostelId: hId })
            }
        });

        res.status(200).json({ success: true, data: students });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
};


// Get student by ID
exports.getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const { gId } = req.query;

        const student = await HostelUserRoleMapping.findOne({
            where: { 
                userId: id, 
                roleId: 5,
                ...(gId && { hostelId: gId })
            },
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Role, attributes: ['id', 'name'] }
            ]
        });

        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        res.status(200).json({ success: true, data: student });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
};


// Get all staff
exports.getAllStaff = async (req, res) => {
    try {
        const staff = await HostelUserRoleMapping.findAll({
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Role, attributes: ['id', 'name'] }
            ],
            where: { roleId: 4 } // assuming 3 = Staff role
        });

        res.status(200).json({ success: true, data: staff });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
};

// Get staff by ID
exports.getStaffById = async (req, res) => {
    try {
        const { id } = req.params;

        const staff = await HostelUserRoleMapping.findOne({
            where: { userId: id, roleId: 4 },
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Role, attributes: ['id', 'name'] }
            ]
        });

        if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });

        res.status(200).json({ success: true, data: staff });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
};
