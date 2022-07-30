const db = require('../data/models/index.js');
const { handleError } = require('../modules/errorHandling.js');
const logger = require('./logger.js');
const { MessageMentions: { ChannelsPattern } } = require('discord.js');

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

exports.shuffleArray = async (array) => {
	return array.sort(() => Math.random() - 0.5);
};

exports.checkValidChannel = async (message, content) => {

	try {

		const match = await content.match(ChannelsPattern);
		if (!match) {
			return false;
		}

		const id = match[1];

		if (!await message.guild.channels.cache.get(id)) {
			return false;
		}

		return true;

	}
	catch (error) {
		handleError(null, error);
	}

};

exports.getGuildSettings = async (reference) => {
	try {
		const settings = db.sequelize.models.Guilds.findOne({
			where: {
				id: reference.guild.id
			},
			raw: true,
			required: false,
		})
		if (settings === null) {
			return null
		}
		return settings

	}
	catch (error) {
		handleError(null, error)
	}
}

exports.getUserLevel = async (guildSettings, reference) => {
	const userLevels = ['User']
	try {
		if (reference.member.roles.cache.has(guildSettings.admin_role)) {
			userLevels.push("Bot Admin")
		}
		if (reference.member.roles.cache.has(guildSettings.dev_role)) {
			userLevels.push("Bot Dev")
		}
		return userLevels
	}
	catch {
		handleError(null, error)
	}

}

/* exports.checkValidRole = async (guild, roleId) => {

	if (guild.channels.exists())


	} */