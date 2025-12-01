module.exports = (sequelize, DataTypes) => {
    const TestNw = sequelize.define("TestNw", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        }

    }, {
        tableName: "testNw"
    });

    return TestNw;

};