module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    }, {
        tableName: 'roles',
        timestamps: true,
    });

    Role.associate = (models) => {
        // ROLE ↔ USER
        Role.belongsToMany(models.User, {
            through: models.HostelUserRoleMapping,
            foreignKey: 'roleId',
            otherKey: 'userId',
            as: 'users'
        });

        // ROLE ↔ HOSTEL
        Role.belongsToMany(models.Hostel, {
            through: models.HostelUserRoleMapping,
            foreignKey: 'roleId',
            otherKey: 'hostelId',
            as: 'hostels'
        });

        Role.hasMany(models.HostelUserRoleMapping, { foreignKey: 'roleId' });
    };

    return Role;
};
