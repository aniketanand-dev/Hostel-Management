const roleFeatures = require('./../config/role-features.config');

class HomeService {
    static getFeaturesByRole(role) {
        return roleFeatures[role] || [];
    }
}

module.exports = HomeService;
