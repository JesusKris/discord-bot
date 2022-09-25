const { SlashCommandBuilder } = require("discord.js");


module.exports = {

	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Get a list of commands")
		.addStringOption(option =>
			option.setName("category")
				.setDescription("The commands category")
				.addChoices(
					{ name: "admin", value: "admin" },
					{ name: "developer", value: "developer" },
				)),

};