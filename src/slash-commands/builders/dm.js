const { SlashCommandBuilder } = require('discord.js');


module.exports = {

	data: new SlashCommandBuilder()
		.setName('dm')
		.setDescription('Get a list of commands')
		.addRoleOption(option =>
			option
				.setName('role')
				.setDescription('The role user has to have in order to receive the message')
				.setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName('message')
				.setDescription('The message you wish to send.')
				.setRequired(true),
		),

};