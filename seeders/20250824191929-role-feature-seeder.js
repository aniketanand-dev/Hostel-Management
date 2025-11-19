"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        const mappings = [
            // SUPER_ADMIN — gets everything
            { roleId: 1, featureId: 1, createdAt: now, updatedAt: now },
            { roleId: 1, featureId: 2, createdAt: now, updatedAt: now },
            { roleId: 1, featureId: 3, createdAt: now, updatedAt: now },
            { roleId: 1, featureId: 4, createdAt: now, updatedAt: now },
            { roleId: 1, featureId: 5, createdAt: now, updatedAt: now },

            // ADMIN
            { roleId: 2, featureId: 1, createdAt: now, updatedAt: now },
            { roleId: 2, featureId: 2, createdAt: now, updatedAt: now },

            // WARDEN
            { roleId: 3, featureId: 2, createdAt: now, updatedAt: now },
            { roleId: 3, featureId: 5, createdAt: now, updatedAt: now },

            // STAFF
            { roleId: 4, featureId: 1, createdAt: now, updatedAt: now },

            // STUDENT
            { roleId: 5, featureId: 3, createdAt: now, updatedAt: now },
            { roleId: 5, featureId: 4, createdAt: now, updatedAt: now }
        ];

        await queryInterface.bulkInsert("role_features", mappings);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete("role_features", null);
    }
};
