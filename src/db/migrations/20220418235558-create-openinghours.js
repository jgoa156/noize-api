"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("OpeningHours", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			placeId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			day: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			hourStart: {
				type: Sequelize.TIME,
				allowNull: false
			},
			hourEnd: {
				type: Sequelize.TIME,
				allowNull: false
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn("NOW"),
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn("NOW"),
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("OpeningHours");
	},
};
