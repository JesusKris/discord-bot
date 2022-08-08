const { Formatters } = require('discord.js');
const { getLogEmbed } = require('../bot-responses/embeds/log');
const { handleError } = require('../modules/errorHandling');
const db = require('../data/models/index.js');
const config = require('../appconfig.js');

exports.run = async (client, message, args, permissions) => {
/* 	try {
		const answer = await askForConfirm(client, message);
		console.log(answer);
		switch (answer) {
		case 'yes':
			console.log('here');

		case 'no':
			return;
		}
	}
	catch (error) {
		handleError(client, error);
	} */

};

exports.config = {
	enabled: true,
	name: 'shutdown',
	setupRequired: true,
	requiredPermission: config.client.commands.permissions.developer,
	guildOnly: true,
	description: 'This will shutdown the bot.\n\nE: !help admin',
	args: [''],
	maxArgs: 0,
};

async function askForConfirm(client, message) {
	try {
		await message.channel.send('Are you sure?');
		const filter = m => m.content === 'yes' || m.content === 'no';
		const answer = await message.channel.awaitMessages({
			filter: filter,
			max: 1,
			time: 60 * 1000,
		});
		return answer.first().content;
	}
	catch (error) {
		handleError(client, error);
	}
}

