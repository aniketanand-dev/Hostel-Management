module.exports = (sequelize, DataTypes) => {
    const Hostel = sequelize.define('Hostel', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        hostelName: { type: DataTypes.STRING, allowNull: false, unique: true },
        location: { type: DataTypes.STRING, allowNull: false },
        isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
        capacity: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        tableName: 'hostels',
        timestamps: true
    });

    Hostel.associate = (models) => {
        Hostel.belongsToMany(models.User, {
            through: models.HostelUserRoleMapping,
            foreignKey: 'hostelId',
            otherKey: 'userId',
            as: 'users'
        });

        Hostel.belongsToMany(models.Role, {
            through: models.HostelUserRoleMapping,
            foreignKey: 'hostelId',
            otherKey: 'roleId',
            as: 'roles'
        });

        Hostel.hasMany(models.Building, { foreignKey: 'hostelId' });
        Hostel.hasMany(models.HostelUserRoleMapping, { foreignKey: 'hostelId' });
    };

    return Hostel;
};
