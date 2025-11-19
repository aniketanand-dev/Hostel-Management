"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const features = [
            { name: "VIEW_DASHBOARD", createdAt: new Date(), updatedAt: new Date() },
            { name: "MANAGE_STUDENTS", createdAt: new Date(), updatedAt: new Date() },
            { name: "VIEW_FEES", createdAt: new Date(), updatedAt: new Date() },
            { name: "PAY_FEES", createdAt: new Date(), updatedAt: new Date() },
            { name: "ALLOCATE_ROOM", createdAt: new Date(), updatedAt: new Date() }
        ];

        await queryInterface.bulkInsert("features", features);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete("features", null);
    }
};
