const config = require("../appconfig.js");
const { handleError } = require("../modules/errorHandling.js");
const db = require("../data/models/index.js");
const { getStandardEmbed } = require("../bot-responses/embeds/standard.js");
const { bold } = require("discord.js");

exports.run = async (client, interaction, permissions) => {
	try {
		await interaction.deferReply({ ephemeral: true, content: "Thinking..." });

	}
	catch (error) {
		handleError(error)
	}
};

exports.config = {
	enabled: true,
	name: "settings",
	setupRequired: true,
	requiredPermission: config.client.commands.permissions.admin,
	guildOnly: true,
	description: "This will setup the bot in the server",
	args: [""],
	maxArgs: 0,
};