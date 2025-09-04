'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const roles = ['SUPER_ADMIN', 'ADMIN', 'WARDEN', 'STAFF', 'STUDENT'];
        const timestamp = new Date();

        const roleData = roles.map(name => ({
            name,
            createdAt: timestamp,
            updatedAt: timestamp
        }));

        return queryInterface.bulkInsert('roles', roleData, {});
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('roles', null, {});
    }
};
