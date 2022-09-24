const { SlashCommandBuilder } = require('discord.js');


module.exports = {

	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Restarts the bot'),


};