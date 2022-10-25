const { SlashCommandBuilder } = require("discord.js");


module.exports = {

	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Get a list of all the available commands"),

};