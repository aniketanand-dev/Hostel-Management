const { Test, sequelize } = require('./../../models');

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