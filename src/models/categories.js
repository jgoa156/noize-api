"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Categories extends Model {
		static associate(models) {
			this.belongsToMany(models.Tags, {
				through: "CategoryTags",
				as: "tags",
				foreignKey: "categoryId",
			});
		}
	}

	Categories.init(
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
			modelName: "Categories",
		}
	);
	return Categories;
};
