const { SlashCommandBuilder } = require("discord.js");


module.exports = {
	data: new SlashCommandBuilder()
		.setName("polls")
		.setDescription("Interact with polls features")
		.addSubcommand(subcommand =>
			subcommand
				.setName("create")
				.setDescription("Create a poll")
				.addStringOption(option =>
					option
						.setName("description")
						.setDescription("Description for the message f.e. \"Do you like animals?\" ")
						.setRequired(true),
				)
				.addChannelOption(option =>
					option.setName("channel")
						.setDescription("Channel where the message will be posted")
						.setRequired(true),
				)
				.addIntegerOption(option =>
					option.setName("votes-limit")
						.setDescription("How many options can user vote for")
						.setMinValue(1)
						.setMaxValue(10)
						.setRequired(true),
				)
				.addStringOption(option =>
					option
						.setName("option-1")
						.setDescription("Poll option that users can vote for")
						.setRequired(true),
				)
				.addStringOption(option =>
					option
						.setName("option-2")
						.setDescription("Poll option that users can vote for")
						.setRequired(true),
				)
				.addStringOption(option =>
					option
						.setName("option-3")
						.setDescription("Poll option that users can vote for")
						.setRequired(false),
				)
				.addStringOption(option =>
					option
						.setName("option-4")
						.setDescription("Poll option that users can vote for")
						.setRequired(false),
				)
				.addStringOption(option =>
					option
						.setName("option-5")
						.setDescription("Poll option that users can vote for")
						.setRequired(false),
				)
				.addStringOption(option =>
					option
						.setName("option-6")
						.setDescription("Poll option that users can vote for")
						.setRequired(false),
				)
				.addStringOption(option =>
					option
						.setName("option-7")
						.setDescription("Poll option that users can vote for")
						.setRequired(false),
				)
				.addStringOption(option =>
					option
						.setName("option-8")
						.setDescription("Poll option that users can vote for")
						.setRequired(false),
				)
				.addStringOption(option =>
					option
						.setName("option-9")
						.setDescription("Poll option that users can vote for")
						.setRequired(false),
				)
				.addStringOption(option =>
					option
						.setName("option-10")
						.setDescription("Poll option that users can vote for")
						.setRequired(false),
				)
		)
		
        .addSubcommand(subcommand =>
			subcommand
				.setName("finish")
				.setDescription("Finish a poll and display results")
				.addStringOption(option =>
					option
						.setName("message-link")
						.setDescription("Link to the message that you want to finish")
						.setRequired(true),
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("sync")
				.setDescription("Syncs and validates all poll messages in the server"),
		),
};