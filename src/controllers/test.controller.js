const { Test, sequelize, TestNw } = require('./../../models');

exports.practice = async (req, res) => {
    try {
        const t = await sequelize.transaction();

        const { data } = req.body;
        //console.log(data);
        await Test.create(data[0], { transaction: t })
        t.commit();
        res.status(200).json({
            success: true,
            message: "Data save successfully"
        })
    } catch (error) {
        t.rollback();
        //template litterals
        //console.log(`error becz of ${error}`);
        res.status(500).json({ message: "Internal server error" })
    }
};

exports.testNw = async (req, res) => {
    try {

        const t = await sequelize.transaction()
        const { data } = req.body;
        console.log(data);

        await TestNw.create(data, { transaction: t })
        t.commit()
        res.status(201).json({ success: true, message: 'Data save successfully' });
    } catch (err) {
        t.rollback()
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
};

exports.addUserTest = async (req, res) => {
    try {
        const { data } = req.res;
        const t = sequelize.transaction();
        //atomacity means it will store all the trancation or else it will rollback
        await TestNw.create(data, { transaction: t })
        t.commit()
        res.status(201).json({ message: 'Data stored..' })

    } catch (err) {
        t.rollback();
        res.status(500).json({ message: 'Data stored..' })
    }
};

exports.getUserTestNw = async (req, res) => {
    try {
        const userData = await TestNw.findAll({

            where: {},
            attributes: ['id', 'name']
        })

        res.status(200).json({ success: true, data: userData })
    } catch (err) {
        res.status(500).json({ success: false, error: err })
    }
};