"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Users extends Model {
		static associate(models) {
			this.hasMany(models.Reviews, {
				foreignKey: "userId",
				as: "reviews",
			});

			this.hasMany(models.Tokens, {
				foreignKey: "userId",
				as: "tokens",
			});
		}
	}
	Users.init(
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
					len: [10, 255],
				},
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true,
					len: [4, 255],
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [4, 255],
				},
			},
			confirmedEmail: {
				allowNull: false,
				defaultValue: false,
				type: DataTypes.BOOLEAN,
			},
		},
		{
			sequelize,
			modelName: "Users",
		}
	);
	return Users;
};
