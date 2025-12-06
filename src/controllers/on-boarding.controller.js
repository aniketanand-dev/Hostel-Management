const onboardingService = require('./../services/on-boarding.service');
const { sequelize, Hostel, User, Role, HostelUserRoleMapping } = require('./../../models/index');
const { hashPassword } = require('./../utils/hash.util');
const { generateLoginToken } = require('./../services/jwt.service');

exports.createHostelWithSuperAdmin = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { hostelName, location, capacity, admin } = req.body;
        // admin = { name, email, password }

        if (!admin || !admin.email || !admin.password || !admin.name) {
            throw new Error("Admin details are required with name, email, and password");
        }

        // 1. Create the hostel
        const hostel = await Hostel.create(
            { hostelName, location, capacity },
            { transaction: t }
        );

        // 2. Check if user already exists
        let user = await User.findOne({ where: { email: admin.email }, transaction: t });

        if (!user) {
            // Hash the password before saving
            const hashedPassword = await hashPassword(admin.password);

            // Create the user
            user = await User.create(
                { name: admin.name, email: admin.email, password: hashedPassword },
                { transaction: t }
            );
        }

        // 3. Find the SUPER_ADMIN role
        const role = await Role.findOne({ where: { name: 'SUPER_ADMIN' }, transaction: t });
        if (!role) {
            throw new Error("SUPER_ADMIN role not found");
        }

        // 4. Map the user to the hostel with SUPER_ADMIN role
        const existingMapping = await HostelUserRoleMapping.findOne({
            where: {
                userId: user.id,
                hostelId: hostel.id,
                roleId: role.id
            },
            transaction: t
        });

        if (!existingMapping) {
            await HostelUserRoleMapping.create(
                {
                    userId: user.id,
                    hostelId: hostel.id,
                    roleId: role.id
                },
                { transaction: t }
            );
        }

        // 5. Commit the transaction
        await t.commit();

        // 6. Return success response
        return res.status(201).json({
            success: true,
            message: "Hostel and Super Admin created successfully",
            data: {
                hostel,
                superAdmin: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            }
        });

    } catch (err) {
        // Rollback transaction on error
        await t.rollback();

        console.error("Error creating hostel and super admin:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to create hostel and super admin",
            error: err.message
        });
    }
};

exports.createUser = async (req, res) => {
    try {
        const t = await sequelize.transaction();
        const { name, email, password = "123456", roleName } = req.body;
        const hostelId = req.user.hId
        if (!roleName || !['STUDENT', 'STAFF'].includes(roleName)) {
            return res.status(400).json({ error: 'Invalid or missing roleName. Allowed values: STUDENT, STAFF' });
        }

        // Check if user exists
        let user = await User.findOne({ where: { email }, transaction: t });

        if (!user) {
            //console.log(user);
            const hashedPassword = await hashPassword(password);
            user = await User.create(
                { name, email, password: hashedPassword },
                { transaction: t }
            );
        }

        // Find the role
        const role = await Role.findOne({ where: { name: roleName }, transaction: t });
        if (!role) throw new Error(`${roleName} role not found`);

        // Check if mapping exists
        const existingMapping = await HostelUserRoleMapping.findOne({
            where: {
                userId: user.id,
                hostelId,
                roleId: role.id
            },
            transaction: t
        });

        // Create mapping if not exists
        if (!existingMapping) {
            await HostelUserRoleMapping.create(
                {
                    userId: user.id,
                    hostelId,
                    roleId: role.id
                },
                { transaction: t }
            );
        }

        await t.commit();
        res.status(201).json({ user, message: `${roleName.charAt(0) + roleName.slice(1).toLowerCase()} created` });

    } catch (err) {
        await t.rollback();
        console.error(err);
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
        //console.log(email);

        const result = await onboardingService.loginUser({ email, password });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                //user: result.user,
                token: result.token,
                //roles: result.roles
            }
        });
    } catch (err) {
        let statusCode = 400;

        // Match different errors with correct HTTP codes
        if (err.message.includes('User not found')) {
            statusCode = 404; // Not Found
        } else if (err.message.includes('Email not verified')) {
            statusCode = 403; // Forbidden
        } else if (err.message.includes('Password not updated')) {
            statusCode = 403; // Forbidden
            return res.status(statusCode).json({
                success: false,
                message: err.message,
                passwordUpdate: false
            });
        } else if (err.message.includes('Incorrect password')) {
            statusCode = 401; // Unauthorized
        }

        res.status(statusCode).json({
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
        const { id, email } = req.user;

        const mappings = await HostelUserRoleMapping.findAll({
            where: { userId: id, isActive: true },
            include: [
                {
                    model: Hostel,
                    attributes: ["hostelName", "location", "capacity"]
                },
                {
                    model: Role,
                    attributes: ["id", "name"]
                }
            ]
        });

        if (!mappings.length) {
            return res.status(404).json({ success: false, message: "No hostel assigned" });
        }

        const roles = [...new Set(mappings.map(m => m.Role.name))];

        const hostels = mappings.map(m => ({
            hostel: m.Hostel,
            hostelId: m.hostelId,
            roleId: m.roleId,
            roleName: m.Role.name
        }));

        let allowedHostels;

        if (roles.includes("STUDENT")) {
            allowedHostels = [hostels[0]];
        } else {
            allowedHostels = hostels;
        }

        const tokens = allowedHostels.map(h => {
            const payload = {
                id,
                email,
                hId: h.hostelId,
                roleId: h.roleId,
                type: "login"
            };

            return {
                hostelName: h.hostel.hostelName,
                roleName: h.roleName,
                token: generateLoginToken(payload)
            };
        });

        return res.status(200).json({
            success: true,
            tokens
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
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


exports.getRolesForLoggedInUserAndHostel = async (req, res) => {
    try {
        const userId = req.user.id;
        const hostelId = req.user.hId;
        const email = req.user.email;

        if (!userId || !hostelId) {
            return res.status(400).json({
                success: false,
                message: "Missing userId or hostelId in token"
            });
        }

        const mappings = await HostelUserRoleMapping.findAll({
            where: {
                userId,
                hostelId,
                isActive: true
            },
            include: [
                {
                    model: Role,
                    attributes: ["id", "name"]
                }
            ]
        });

        if (!mappings.length) {
            return res.status(404).json({
                success: false,
                message: "No roles assigned for this user in this hostel"
            });
        }

        // Generate one token per role
        const result = mappings.map(m => {
            const payload = {
                id: userId,
                hId: hostelId,
                rId: m.roleId,
                email,
                type: "login"
            };

            return {
                roleName: m.Role.name,
                token: generateLoginToken(payload)
            };
        });

        return res.status(200).json({
            success: true,
            roles: result
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

