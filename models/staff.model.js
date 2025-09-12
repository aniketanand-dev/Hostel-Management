module.exports = (sequelize, DataTypes) => {

    const Staff = sequelize.define('Staff', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        passwordUpdated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'staff',
        timestamps: true,
    })

    return Staff;
}