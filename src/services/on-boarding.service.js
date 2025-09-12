const { sequelize, User, Role, Hostel, HostelUserRoleMapping, OTP } = require('../../models');
const { hashPassword, comparePassword } = require('./../utils/hash.util');
const { generateOtp } = require('./../utils/otp.util');
const { sendEmail } = require('./../utils/email.util');
const { generateLoginToken } = require('../services/jwt.service');


exports.getRoles = async () => {
    return await Role.findAll();
};

exports.sendOtpToEmail = async (email) => {
    const t = await sequelize.transaction();
    try {
        const otp = generateOtp();

        await OTP.create({ email, otp }, { transaction: t });
        await sendEmail(email, 'OTP Verification', `Your OTP is: ${otp}`);

        await t.commit();
        return otp;
    } catch (err) {
        await t.rollback();
        throw err;
    }
};

exports.verifyOtp = async (email, otp) => {
    const t = await sequelize.transaction();
    try {
        // Check if OTP exists
        const record = await OTP.findOne({ where: { email, otp }, transaction: t });
        if (!record) throw new Error('Invalid OTP');

        // Delete OTP after verification
        await OTP.destroy({ where: { email, otp }, transaction: t });

        // Update user as verified
        await User.update(
            { isVerified: true },
            { where: { email }, transaction: t }
        );

        await t.commit();
        return true;
    } catch (err) {
        await t.rollback();
        throw err;
    }
};

exports.loginUser = async ({ email, password }) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('User not found');

    if (!user.isVerified) {
        const otp = generateOtp();
        await OTP.create({ email, otp });
        sendEmail(email, 'OTP Verification', `Your OTP is: ${otp}`).catch(console.error);
        throw new Error('Email not verified. OTP sent to your email.');
    }

    if (!user.passwordUpdated) throw new Error('Password not updated. Set a new password.');

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error('Incorrect password');

    const token = generateLoginToken(user);

    // Fetch all role mappings
    const mappings = await HostelUserRoleMapping.findAll({
        where: { userId: user.id },
        include: [{ model: Role, attributes: ['id', 'name'] }]
    });

    // Deduplicate roles
    const roleMap = {};
    mappings.forEach(m => {
        const roleName = m.Role.name;
        if (!roleMap[roleName]) roleMap[roleName] = [];
        roleMap[roleName].push(m.hostelId);
    });

    const roles = Object.keys(roleMap).map(roleName => ({
        role: roleName,
        hostels: roleMap[roleName]
    }));

    return { user, token, roles };
};


exports.sendForgetPasswordOtp = async (email) => {
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error('User not found');
        console.log(user);

        // Check if user is verified
        if (!user.isVerified) {
            throw new Error('User is not verified. Cannot reset password.');
        }

        // Generate OTP
        const otp = generateOtp();

        // Save OTP in DB (replace old one if exists for same email)
        await OTP.upsert({ email, otp });

        // Send email with OTP
        await sendEmail(email, 'Reset Password OTP', `Your OTP is: ${otp}`);

        return { message: 'OTP sent to your email for password reset' };
    } catch (err) {
        throw err;
    }
};


exports.resetPassword = async (email, otp, newPassword) => {
    const t = await sequelize.transaction();
    try {
        const record = await OTP.findOne({ where: { email, otp }, transaction: t });
        if (!record) {
            throw new Error("Invalid or expired OTP");
        }

        await OTP.destroy({ where: { email, otp }, transaction: t });

        const hashedPassword = await hashPassword(newPassword);

        await User.update(
            { password: hashedPassword, passwordUpdated: true },
            { where: { email }, transaction: t }
        );

        await t.commit();
        return { message: "Password reset successfully" };
    } catch (err) {
        await t.rollback();
        throw err;
    }
};
