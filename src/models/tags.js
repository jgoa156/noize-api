"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Tags extends Model {
		static associate(models) {
			this.belongsToMany(models.Categories, {
				through: models.ReviewTags,
				as: "categories",
				foreignKey: "tagId",
			});

			this.belongsToMany(models.Reviews, {
				through: models.ReviewTags,
				as: "reviews",
				foreignKey: "tagId",
			});
		}
	}

	Tags.init(
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
			modelName: "Tags",
		}
	);
	return Tags;
};
