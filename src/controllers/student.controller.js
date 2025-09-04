const { User, HostelUserRoleMapping, Role } = require('../models');

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await HostelUserRoleMapping.findAll({
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Role, attributes: ['id', 'name'] }
            ],
            where: { roleId: 2 }
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

        const student = await HostelUserRoleMapping.findOne({
            where: { userId: id, roleId: 2 },
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
