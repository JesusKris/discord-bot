const db = require('../data/models/index.js');
const { handleError } = require('../modules/errorHandling.js');
const logger = require('./logger.js');
const { MessageMentions: { ChannelsPattern } } = require('discord.js');
const { getStandardEmbed } = require('../bot-responses/embeds/standard.js');
const { getWarningEmbed } = require('../bot-responses/embeds/warning.js');
const config = require('../appconfig.js');

exports.pingDB = async () => {
	logger.log('Pinging database for connection pool..');
	try {
		await db.sequelize.authenticate();
		logger.ready('Succesfully received back a connection pool..');
	}
	catch (error) {
		handleError(error);
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
		handleError(error);
	}

};

exports.getGuildSettings = async (reference) => {
	try {
		const settings = db.sequelize.models.Guilds.findOne({
			where: {
				id: reference.guild.id,
			},
			raw: true,
			required: false,
		});
		if (settings === null) {
			return null;
		}
		return settings;

	}
	catch (error) {
		handleError(error);
	}
};

exports.noPermissionReply = async (message) => {
	const warning = await message.channel.send({ embeds: [await getWarningEmbed(null, 'You don\'t have permission to use this command!')] });

	await this.sleep(2500);
	await warning.delete();
	await message.delete();
};

exports.warningReply = async (messageObject, message) => {
	const warning = await messageObject.channel.send({ embeds: [await getWarningEmbed(null, message)] });

	await this.sleep(2500);
	await warning.delete();
	await messageObject.delete();
};

exports.noPermissionsInteraction = async (interaction) => {
	return await interaction.reply({ embeds: [await getWarningEmbed(null, 'You don\'t have permission to use this command!')], ephemeral: true });
};