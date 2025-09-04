module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define('Student', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
        gender: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tablename: "student",
        timesStamps: true
    });

    return Student;
}