"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class PlaceImages extends Model {
		static associate(models) {
			this.belongsTo(models.Places, {
				foreignKey: "placeId",
				as: "place",
			});
		}
	}

	PlaceImages.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			link: {
				type: DataTypes.TEXT("medium"),
				allowNull: false,
			},
			placeId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "PlaceImages",
		}
	);
	return PlaceImages;
};
