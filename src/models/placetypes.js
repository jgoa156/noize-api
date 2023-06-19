"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class PlaceTypes extends Model {
		static associate(models) {
			this.belongsToMany(models.Places, {
				through: "PlaceTypes",
				as: "places",
				foreignKey: "placeTypeId",
			});
		}
	}

	PlaceTypes.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					len: [1, 255],
				},
			},
		},
		{
			sequelize,
			modelName: "PlaceTypes",
		}
	);
	return PlaceTypes;
};
