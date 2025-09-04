module.exports = {
    up: async (queryInterface) => {
        await queryInterface.removeConstraint(
            'hostelUserRoleMappings',
            'hostelUserRoleMappings_hostelId_key',
            "hostelUserRoleMappings_userId_roleId_key"
        );
    },

    down: async (queryInterface) => {
        await queryInterface.addConstraint('hostelUserRoleMappings', {
            fields: ['hostelId'],
            type: 'unique',
            name: 'hostelUserRoleMappings_hostelId_key'
        });
    }
};

//npx sequelize db:migrate

