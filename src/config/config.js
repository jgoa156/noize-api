require("dotenv").config();

module.exports = {
  development: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_LOCAL_PORT,
    dialect: process.env.SEQUELIZE_DIALECT,
    timezone: '-04:00'
  },
  test: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_LOCAL_PORT,
    dialect: process.env.SEQUELIZE_DIALECT,
    timezone: '-04:00'
  },
  production: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_LOCAL_PORT,
    dialect: process.env.SEQUELIZE_DIALECT,
    timezone: '-04:00'
  },
};
