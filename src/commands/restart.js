const config = require('../appconfig.js');

exports.run = async (client, message, args, permissions) => {


};

exports.config = {
	enabled: true,
	name: 'restart',
	setupRequired: true,
	requiredPermission: config.client.commands.permissions.developer,
	guildOnly: true,
	description: 'This will restart the bot.\n\nE: !help admin',
	args: ['<reason>'],
	maxArgs: 1,
};