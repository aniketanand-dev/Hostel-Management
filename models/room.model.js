module.exports = (sequelize, DataTypes) => {
    const Room = sequelize.define('Room', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        roomNumber: { type: DataTypes.STRING, allowNull: false },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        floorId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'floor', key: 'id' }, onDelete: 'CASCADE' },
        isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        type: { type: DataTypes.ENUM('SINGLE', 'DOUBLE', 'TRIPLE'), allowNull: false, defaultValue: 'SINGLE' },
        capacity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
    }, {
        tableName: 'room',
        timestamps: true
    });

    Room.associate = (models) => {
        Room.belongsTo(models.Floor, { foreignKey: 'floorId', as: 'floor' });
        Room.hasMany(models.Bed, { foreignKey: 'roomId', as: 'beds' });
        Room.hasMany(models.RoomAllocation, { foreignKey: 'roomId', as: 'allocations' });
    };

    return Room;
};
