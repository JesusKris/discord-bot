const config = require("./../appconfig.js");
const logger = require("../modules/logger.js");
const { pingDB } = require("../modules/database.js");
const { ActivityType } = require("discord.js");
const { handleError } = require("../modules/errorHandling.js");

module.exports = async (client) => {

	logger.ready(`Succesfully started the application and logged in as ${client.user.tag}`);

	logger.ready(`Online in ${client.guilds.cache.size} servers`);

	function setActivityStatus() {
		const random = Math.floor(Math.random() * config.client.activityStatus.choices.length);
		client.user.setActivity(`${config.client.activityStatus.choices[random]}`, { type: ActivityType.Playing });
	}

	try {
		setInterval(setActivityStatus, config.client.activityStatus.timer);
		setInterval(pingDB, config.statusChecks.databaseTimer);
	}
	catch (error) {
		handleError(error);
	}
};
