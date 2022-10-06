const config = require("../appconfig.js");
const { handleError } = require("../modules/errorHandling.js");
const db = require("../data/models/index.js");
const { getStandardEmbed } = require("../bot-responses/embeds/standard.js");
const { bold } = require("discord.js");

exports.run = async (client, interaction, permissions) => {
	try {
		await interaction.deferReply({ ephemeral: true, content: "Thinking..." });
        

        if (interaction.options.getSubcommand() === 'list') {


        }

        if (interaction.options.getSubcommand() === 'change') {

            

        }

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
	description: "List the server settings. Change a specific server setting",
	args: "<list> <change>",
	//Needed for legacy commands
	// maxArgs: 0,
};