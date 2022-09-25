const { SlashCommandBuilder } = require("discord.js");


module.exports = {
	data: new SlashCommandBuilder()
		.setName("react-roles")
		.setDescription("Interact with reaction roles features")
		.addSubcommand(subcommand =>
			subcommand
				.setName("create")
				.setDescription("Create a reaction role message.")
				.addChannelOption(option =>
					option
						.setName("channel")
						.setDescription("The channel you want to post the reaction role message.")
						.setRequired(true),
				)
				.addStringOption(option =>
					option
						.setName("title")
						.setDescription("The title you want the message to have.")
						.setRequired(true),
				)
				.addStringOption(option =>
					option
						.setName("description")
						.setDescription("The description you want the message to have.")
						.setRequired(true),
				),


		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("edit")
				.setDescription("Edit a reaction role message.")
				.addStringOption(option =>
					option
						.setName("message_id")
						.setDescription("The reaction role message id you wish to edit.")
						.setRequired(true),
				),


		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("delete")
				.setDescription("Delete a reaction role message.")
				.addStringOption(option =>
					option
						.setName("message_id")
						.setDescription("The reaction role message id you wish to delete.")
						.setRequired(true),
				),
		),


};