module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    }, {
        tableName: 'roles',
        timestamps: true,
    });

    Role.associate = (models) => {
        Role.belongsToMany(models.User, {
            through: models.HostelUserRoleMapping,
            foreignKey: 'roleId',
            otherKey: 'userId',
            uniqueKey: 'hostel_user_role_unique_idx'
        });

        Role.belongsToMany(models.Hostel, {
            through: models.HostelUserRoleMapping,
            foreignKey: 'roleId',
            otherKey: 'hostelId',
            uniqueKey: 'hostel_user_role_unique_idx'
        });

        Role.hasMany(models.HostelUserRoleMapping, { foreignKey: 'roleId' });
    };

    return Role;
};
