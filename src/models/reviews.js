"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Reviews extends Model {
		static associate(models) {
			this.belongsTo(models.Users, {
				foreignKey: "userId",
				as: "user",
			});

			this.belongsTo(models.Places, {
				foreignKey: "placeId",
				as: "place",
			});

			this.belongsToMany(models.Tags, {
				through: "ReviewTags",
				as: "reviews",
				foreignKey: "reviewId",
			});
		}
	}
	Reviews.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			placeId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			stars: {
				type: DataTypes.DOUBLE,
				allowNull: false,
			},
			comment: {
				type: DataTypes.STRING,
				validate: {
					len: [1, 255],
				},
			},
		},
		{
			sequelize,
			modelName: "Reviews",
		}
	);
	return Reviews;
};
