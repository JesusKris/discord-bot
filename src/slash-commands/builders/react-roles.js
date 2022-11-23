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
						.setDescription("Title for the message")
						.setRequired(true),
				)
				.addStringOption(option =>
					option
						.setName("description")
						.setDescription("Description for the message")
						.setRequired(true),
				)
				.addChannelOption(option =>
					option.setName("channel")
						.setDescription("Channel where the message will be posted")
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("edit")
				.setDescription("Edit a reaction roles message title or description")
				.addStringOption(option =>
					option
						.setName("message-link")
						.setDescription("Link to the message that you want to edit")
						.setRequired(true),
				)
				.addStringOption(option =>
					option
						.setName("title")
						.setDescription("The title you wish to edit")
						.setRequired(false),
				)
				.addStringOption(option =>
					option
						.setName("description")
						.setDescription("The description you wish to edit")
						.setRequired(false),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("add")
				.setDescription("Add a react-role to a message")
				.addStringOption(option =>
					option
						.setName("message-link")
						.setDescription("Link to the message that you want to add a react-role to")
						.setRequired(true),
				)
				.addRoleOption(option =>
					option.setName("role")
						.setDescription("The role a person receives when reacting to a role")
						.setRequired(true),
				)
				.addStringOption(option =>
					option
						.setName("emoji")
						.setDescription("The emoji a person can react to receive corresponding role")
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
						.setDescription("Link to the message that you want to remove a react-role from")
						.setRequired(true),
				)
				.addStringOption(option =>
					option
						.setName("emoji")
						.setDescription("React-role that will be removed based on emoji")
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("sync")
				.setDescription("Syncs and validates all react-role messages in the server"),
		),
};