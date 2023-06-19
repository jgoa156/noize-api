"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class ReviewTags extends Model {
		static associate(models) {
		}
	}

	ReviewTags.init(
		{
			reviewId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			categoryId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			tagId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
		},
		{
			sequelize,
			modelName: "ReviewTags",
		}
	);
	return ReviewTags;
};
