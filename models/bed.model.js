module.exports = (sequelize, DataTypes) => {
    const Bed = sequelize.define('Bed', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        roomId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'room', key: 'id' }, onDelete: 'CASCADE' },
        bedNumber: { type: DataTypes.STRING, allowNull: false }
    }, {
        tableName: 'bed',
        timestamps: true
    });

    Bed.associate = (models) => {
        Bed.belongsTo(models.Room, { foreignKey: 'roomId', as: 'room' });
        Bed.hasMany(models.RoomAllocation, { foreignKey: 'bedId', as: 'allocations' });
    };
    return Bed;
};
