const { SlashCommandBuilder } = require("discord.js");


module.exports = {
	data: new SlashCommandBuilder()
		.setName("react-roles")
		.setDescription("Interact with reaction roles features")
		.addSubcommand(subcommand =>
			subcommand
				.setName("create")
				.setDescription("Create a reaction role message")
				.addStringOption(option =>
					option
						.setName("title")
						.setDescription("Set the title for the message")
						.setRequired(true),
				)
				.addStringOption(option =>
					option
						.setName("description")
						.setDescription("Set the description for the message")
						.setRequired(true),
				)
				.addChannelOption(option =>
					option.setName("channel")
						.setDescription("Set the channel where the message will be posted")
						.setRequired(true),
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("add")
				.setDescription("Add a react-role to a message")
				.addStringOption(option =>
					option
						.setName("message-link")
						.setDescription("The link to the message that you want to add a react-role to")
						.setRequired(true),
				)
				.addRoleOption(option =>
					option.setName("role")
						.setDescription("Set the role a person receives when reacting to a role")
						.setRequired(true),
				)
				.addStringOption(option =>
					option
						.setName("emoji")
						.setDescription("Set the emoji a person can react to")
						.setRequired(true),
				),

		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("remove")
				.setDescription("Remove a react-role from a message")
				.addStringOption(option =>
					option
						.setName("message-link")
						.setDescription("The link to the message that you want to remove a react-role from")
						.setRequired(true),
				)
				.addStringOption(option =>
					option
						.setName("emoji")
						.setDescription("Select a react-role that will be removed based on emoji")
						.setRequired(true),
				),
		),
};