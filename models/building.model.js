module.exports = (sequelize, DataTypes) => {
    const Building = sequelize.define('Building', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        buildingName: { type: DataTypes.STRING, allowNull: false, unique: true },
        hostelId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'hostels', key: 'id' }, onDelete: 'CASCADE' }
    }, {
        tableName: 'building',
        timestamps: true
    });

    Building.associate = (models) => {
        Building.belongsTo(models.Hostel, { foreignKey: 'hostelId', as: 'hostel' });
        Building.hasMany(models.Floor, { foreignKey: 'buildingId', as: 'floors' });
    };

    return Building;
};
