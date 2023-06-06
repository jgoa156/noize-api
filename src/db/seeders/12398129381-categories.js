"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		return queryInterface.bulkInsert("Categories", [
			{ name: "Ambiente" },
			{ name: "Música" },
			{ name: "Bebida" },
			{ name: "Comida" },
		]);
	},
	async down(queryInterface, Sequelize) {
		return queryInterface.bulkDelete("Categories", null, {
			truncate: true,
			restartIdentity: true,
		});
	},
};
