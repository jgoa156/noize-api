"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class OpeningHours extends Model {
		static associate(models) {
			this.belongsTo(models.Places, {
				foreignKey: "placeId",
				as: "place",
			});
		}
	}
	OpeningHours.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			placeId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			day: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			hourStart: {
				type: DataTypes.TIME,
				allowNull: false,
			},
			hourEnd: {
				type: DataTypes.TIME,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "OpeningHours",
		}
	);
	return OpeningHours;
};
