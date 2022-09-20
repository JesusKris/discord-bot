const { bold, roleMention } = require('discord.js');


exports.getErrorEmbed = async (name, id, devRole) => {
	const errorEmbed = {
		color: 0xff5050,
		title: `${name}`,
		description: `${bold('Error code: ')}[${id}] ${roleMention(devRole)}`,
		timestamp: new Date(),
	};
	return errorEmbed;
};