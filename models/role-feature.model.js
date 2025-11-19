module.exports = (sequelize, DataTypes) => {
    const RoleFeature = sequelize.define('RoleFeature', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        featureId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isEnable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'role_features',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['roleId', 'featureId']
            }
        ]
    });

    RoleFeature.associate = (models) => {
        RoleFeature.belongsTo(models.Role, { foreignKey: 'roleId' });
        RoleFeature.belongsTo(models.Feature, { foreignKey: 'featureId' });
    };

    return RoleFeature;
};
