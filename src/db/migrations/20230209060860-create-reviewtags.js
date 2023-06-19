"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("ReviewTags", {
			reviewId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			categoryId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			tagId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
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
		await queryInterface.dropTable("ReviewTags");
	},
};
