const db = require('../data/models/index.js');
const { handleError } = require('../modules/errorHandling.js');
const logger = require('./logger.js');
const { MessageMentions: { CHANNELS_PATTERN } } = require('discord.js');

exports.pingDB = async () => {
	logger.log('Pinging database for connection pool..');
	try {
		await db.sequelize.authenticate();
		logger.ready('Succesfully received back a connection pool..');
	}
	catch (error) {
		handleError(null, error);
	}
};

exports.sleep = ms => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

exports.checkValidChannel = async (guild, channelId) => {

	try {
		const match = await channelId.matchAll(CHANNELS_PATTERN).next().value;
		if (!match) {
			return false;
		}

		const id = match[1];

		if (!await guild.channels.cache.get(id)) {
			return false;
		}

		return true;

	}
	catch (error) {
		handleError(null, error);
	}

};

/* exports.checkValidRole = async (guild, roleId) => {

	if (guild.channels.exists())


	} */