"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tokens extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Tokens.init({
    token: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.STRING,
      validate: {
        len: [1, 1],
        isValid(value) {
          if (!["E", "P"].includes(value)) { // [E]mail, [P]assword
            throw new Error("Tipo (token.type) inválido");
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: "Tokens",
  });
  return Tokens;
};
