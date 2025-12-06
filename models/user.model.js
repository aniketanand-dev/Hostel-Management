module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
        password: { type: DataTypes.STRING, allowNull: false },
        isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
        isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
        passwordUpdated: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, {
        tableName: 'users',
        timestamps: true,
    });

    User.associate = (models) => {
        User.belongsToMany(models.Hostel, {
            through: models.HostelUserRoleMapping,
            foreignKey: 'userId',
            otherKey: 'hostelId',
            as: 'hostels'
        });

        User.belongsToMany(models.Role, {
            through: models.HostelUserRoleMapping,
            foreignKey: 'userId',
            otherKey: 'roleId',
            as: 'roles'
        });

        User.hasMany(models.HostelUserRoleMapping, { foreignKey: 'userId' });
        User.hasMany(models.RoomAllocation, { foreignKey: 'userId' });
    };

    return User;
};
