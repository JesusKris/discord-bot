const { handleError } = require('../../modules/errorHandling');
const { bold} = require('discord.js');
const config = require('../../appconfig.js');

exports.getIntroductionMessage = async (client) => {

	try {
		return `"Hey! My name is Robert. To awaken ${bold(config.client.name)}, you must type ${bold(`${config.client.prefix}setup`)} in any channel.\n\n Don't mess this up!"`;
	}
	catch (error) {
		handleError(error);
	}
};