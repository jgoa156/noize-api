'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Tokens', {
			token: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.STRING
			},
			userEmail: {
				allowNull: false,
				type: Sequelize.STRING
			},
			type: {
				allowNull: false,
				type: Sequelize.STRING, // [E]mail, [P]assword
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
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Tokens');
	}
};