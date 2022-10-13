const env = require("dotenv");
env.config({ path: "../../.env" });
const config = require("../../appconfig.js");

module.exports = {
	username: config.sequelize.username,
	password: config.sequelize.password,
	database: config.sequelize.database,
	host: config.sequelize.host,
	dialect: config.sequelize.dialect,
	logging: false,
};