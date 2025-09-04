module.exports = (sequelize, DataTypes) => {
    const Floor = sequelize.define('Floor', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        floorNumber: { type: DataTypes.INTEGER, allowNull: false },
        buildingId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'building', key: 'id' }, onDelete: 'CASCADE' }
    }, {
        tableName: 'floor',
        timestamps: true
    });

    Floor.associate = (models) => {
        Floor.belongsTo(models.Building, { foreignKey: 'buildingId', as: 'building' });
        Floor.hasMany(models.Room, { foreignKey: 'floorId', as: 'rooms' });
    };

    return Floor;
};
