const { handleError } = require('../../modules/errorHandling');
const { Formatters } = require('discord.js');
const config = require('../../appconfig.js');

exports.getIntroductionMessage = async (client) => {

	try {
		return `A bird whipsers:\n\n "Hey! My name is Robert. To awaken ${Formatters.bold(config.client.name)}, you must type ${Formatters.bold('!setup')} in any channel.\n\n Don't mess this up!"`;
	}
	catch (error) {
		handleError(client, error);
	}
};