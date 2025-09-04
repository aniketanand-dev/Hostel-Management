module.exports = (sequelize, DataTypes) => {
    const HostelUserRoleMapping = sequelize.define('HostelUserRoleMapping', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE',
        },
        hostelId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'hostels', key: 'id' },
            onDelete: 'CASCADE',
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'roles', key: 'id' },
            onDelete: 'CASCADE',
        },
    }, {
        tableName: 'hostelUserRoleMappings',
        timestamps: true
    });


    HostelUserRoleMapping.associate = (models) => {
        HostelUserRoleMapping.belongsTo(models.User, { foreignKey: 'userId' });
        HostelUserRoleMapping.belongsTo(models.Hostel, { foreignKey: 'hostelId' });
        HostelUserRoleMapping.belongsTo(models.Role, { foreignKey: 'roleId' });
    };

    return HostelUserRoleMapping;
};
