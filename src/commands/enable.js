const config = require('../appconfig.js');

exports.run = async (client, message, args, permissions) => {


};

exports.config = {
	enabled: true,
	name: 'enable',
	setupRequired: true,
	requiredPermission: config.client.commands.permissions.developer,
	guildOnly: true,
	description: 'Enable a command globally.\n\nE: !help admin',
	args: ['<command>'],
	maxArgs: 1,
};