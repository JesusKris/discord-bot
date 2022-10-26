const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");


module.exports = {

	data: new SlashCommandBuilder()
		.setName("setup")
		.setDescription("Sets the bot up for use in the server")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand
				.setName("main")
				.setDescription("Set the bot up in a main server")
				.addRoleOption(option =>
					option.setName("admin-role")
						.setDescription("Choose the admin role")
						.setRequired(true),
				)
				.addStringOption(option =>
					option.setName("master-password")
						.setDescription("Set the verification master password")
						.setRequired(true),
				)
				.addStringOption(option =>
					option.setName("student-password")
						.setDescription("Set the verification student password")
						.setRequired(true),
				)
				.addStringOption(option =>
					option.setName("guest-password")
						.setDescription("Set the verification guest password")
						.setRequired(true),
				)
				.addRoleOption(option =>
					option.setName("student-role")
						.setDescription("Choose the student role given upon student verification")
						.setRequired(true),
				)
				.addRoleOption(option =>
					option.setName("batch-role")
						.setDescription("Choose the batch role given upon student verification")
						.setRequired(true),
				)
				.addRoleOption(option =>
					option.setName("guest-role")
						.setDescription("Choose the role given upon guest verification")
						.setRequired(true),
				)
				.addChannelOption(option =>
					option.setName("notification-channel")
						.setDescription("Choose the admin notification channel")
						.setRequired(false),
				)
				.addChannelOption(option =>
					option.setName("greetings-channel")
						.setDescription("Choose the greetings notification channel")
						.setRequired(false),
				),

		)

		.addSubcommand(subcommand =>
			subcommand
				.setName("sprint")
				.setDescription("Set the bot up in a sprint server")
				.addRoleOption(option =>
					option.setName("admin-role")
						.setDescription("Choose the admin role")
						.setRequired(true),
				)
				.addChannelOption(option =>
					option.setName("notification-channel")
						.setDescription("Choose the admin notification channel")
						.setRequired(false),
				)
				.addChannelOption(option =>
					option.setName("greetings-channel")
						.setDescription("Choose the greetings notification channel")
						.setRequired(false),
				),
		),
};