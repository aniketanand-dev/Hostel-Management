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
        Role.belongsToMany(models.User, { through: models.HostelUserRoleMapping, foreignKey: 'roleId' });
        Role.belongsToMany(models.Hostel, { through: models.HostelUserRoleMapping, foreignKey: 'roleId' });
        Role.hasMany(models.HostelUserRoleMapping, { foreignKey: 'roleId' });
    };

    return Role;
};
