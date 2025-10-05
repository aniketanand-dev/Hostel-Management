module.exports = (sequelize, DataTypes) => {
    const Test = sequelize.define("Test", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tablename: "test"
    });

    return Test;
};