module.exports = (sequelize, DataTypes) => {
    const Feature = sequelize.define('Feature', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'features',
        timestamps: true
    });

    Feature.associate = (models) => {
        Feature.belongsToMany(models.Role, {
            through: models.RoleFeature,
            foreignKey: 'featureId',
            otherKey: 'roleId'
        });
    };

    return Feature;
};
