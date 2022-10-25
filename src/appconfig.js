require("dotenv").config({ path: "../.env" });
module.exports = {
	// ./data/config/config.js
	sequelize: {
		username: process.env.MARIADB_USER,
		password: process.env.MARIADB_PASSWORD,
		database: process.env.MARIADB_DATABASE,
		host: process.env.MARIADB_HOST,
		dialect: process.env.DB_DIALECT,
		logging: false,
	},

	client: {
		// ./engine.js
		healthcheck: process.env.PORT,
		name: process.env.BOT_NAME,
		token: process.env.BOT_TOKEN,
		prefix: process.env.BOT_PREFIX,
		intents: JSON.parse(process.env.BOT_INTENTS),
		Id: process.env.BOT_ID,
		test_guild: process.env.BOT_TEST_GUILD,

		commands: {
			// ./modules/permissions.js
			permissions: {
				user: "user",
				admin: "admin",
				guildOwner: "owner",
			},
			// time after interaction consideres inactivity
			defaultAwaitTimer: 3 * 60 * 1000,
		},
	},

	// ./modules/error-handling.js
	errorLogs: {
		// time ago when error logs are considered expired
		// current date - days * hours * minutes * seconds * milliseconds
		expired: (new Date() - 7 * 24 * 60 * 60 * 1000),
	},
};