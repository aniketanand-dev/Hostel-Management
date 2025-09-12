module.exports = (sequelize, DataTypes) => {
    const RoomAllocation = sequelize.define('RoomAllocation', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
        roomId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'room', key: 'id' }, onDelete: 'CASCADE' },
        bedId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'bed', key: 'id' }, onDelete: 'CASCADE' },
        startDate: { type: DataTypes.DATE, allowNull: false },
        endDate: { type: DataTypes.DATE, allowNull: true },
        isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        status: { type: DataTypes.ENUM('ACTIVE', 'CANCELLED', 'COMPLETED'), allowNull: false, defaultValue: 'ACTIVE' }
    }, {
        tableName: 'roomAllocation',
        timestamps: true
    });

    RoomAllocation.associate = (models) => {
        RoomAllocation.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        RoomAllocation.belongsTo(models.Room, { foreignKey: 'roomId', as: 'room' });
        RoomAllocation.belongsTo(models.Bed, { foreignKey: 'bedId', as: 'bed' });
    };

    return RoomAllocation;
};
