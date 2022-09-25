const env = require("dotenv");
env.config({ path: "../../.env" });

module.exports = {
	"sequelize": {
		"username": process.env.DB_USERNAME,
		"password": process.env.DB_PASSWORD,
		"database": process.env.DB_DATABASE,
		"host": process.env.DB_HOST,
		"dialect": "mariadb",
		"logging": false,
	},
};