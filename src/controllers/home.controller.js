const HomeService = require('../services/home.service');
const { User, HostelUserRoleMapping, Role } = require('./../../models');

exports.getHome = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch mapping + user + role
        const mapping = await HostelUserRoleMapping.findOne({
            where: { userId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Role,
                    attributes: ['id', 'name']   // get role name
                }
            ]
        });
       

        if (!mapping) {
            return res.status(404).json({ success: false, message: 'User role mapping not found' });
        }

        const role = mapping?.Role.name;
        const hostelId = mapping.hostelId;

        const features = HomeService.getFeaturesByRole(role);

        const data = {
            hostelId,
            features
        };

        return res.status(200).json({ success: true, data });

    } catch (err) {
        console.error("Home API Error:", err);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};
