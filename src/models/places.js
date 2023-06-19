"use strict";
const { Model } = require("sequelize");
const { isLatitude, isLongitude } = require("../utils");

module.exports = (sequelize, DataTypes) => {
	class Places extends Model {
		static associate(models) {
			this.hasMany(models.Reviews, {
				foreignKey: "placeId",
				as: "reviews",
			});

			this.hasMany(models.PlaceImages, {
				foreignKey: "placeId",
				as: "images",
			});

			this.hasMany(models.OpeningHours, {
				foreignKey: "placeId",
				as: "openingHours",
			});

			this.belongsToMany(models.PlaceTypes, {
				through: "PlaceTypes",
				as: "placetypes",
				foreignKey: "placeId",
			});
		}
	}
	Places.init(
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
				validate: {
					len: [1, 255],
				},
			},
			address: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [4, 255],
				},
			},
			lat: {
				type: DataTypes.DOUBLE,
				allowNull: false,
				validate: {
					len: [4, 255],
					isValid(value) {
						if (!isLatitude(value)) {
							throw new Error("Valor da latitude inválido");
						}
					},
				},
			},
			lng: {
				type: DataTypes.DOUBLE,
				allowNull: false,
				validate: {
					len: [4, 255],
					isValid(value) {
						if (!isLongitude(value)) {
							throw new Error("Valor da longitude inválido");
						}
					},
				},
			},
		},
		{
			sequelize,
			modelName: "Places",
		}
	);
	return Places;
};
