const { SlashCommandBuilder } = require("discord.js");


module.exports = {
	data: new SlashCommandBuilder()
		.setName("settings")
		.setDescription("See the server settings")
		.addSubcommand(subcommand =>
			subcommand
				.setName("list")
				.setDescription("See the server settings"),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("change")
				.setDescription("Change a server setting")
				.addStringOption(option =>
					option
						.setName("setting")
						.setDescription("Select the server setting you wish to change")
						.setRequired(true)
						.addChoices(
							{ name: "notification_channel", value: "notification_channel" },
							{ name: "greetings_channel", value: "greetings_channel" },
							{ name: "admin_role", value: "admin_role" },
							{ name: "batch_role", value: "batch_role" },
							{ name: "student_role", value: "student_role" },
							{ name: "guest_role", value: "guest_role" },
							{ name: "master_password", value: "master_password" },
							{ name: "student_password", value: "student_password" },
							{ name: "guest_password", value: "guest_password" },
						),
				)
				.addStringOption(option =>
					option
						.setName("value")
						.setDescription("Set the new value for the setting specified. To disable notifications or greetings, enter \"Disabled\"")
						.setRequired(true),
				),
		),
};