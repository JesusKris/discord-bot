const config = require('../appconfig.js');

exports.run = async (client, message, args, levels) => {


};

exports.config = {
	enabled: true,
	name: 'status',
	setupRequired: true,
	requiredPermission: config.client.commands.permissions.developer,
	guildOnly: true,
	description: 'This will give you a list of all the commands with their enable status.\n\nE: !help admin',
	args: [''],
	maxArgs: 0,
};