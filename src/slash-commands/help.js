const config = require("../appconfig.js");
const { handleError } = require("../modules/errorHandling.js");
const { bold, codeBlock } = require("discord.js");
const { getStandardEmbed } = require("../bot-responses/embeds/standard");

exports.run = async (client, interaction, permissions) => { // eslint-disable-line
	try {

		return sendHelpEmbed(client, interaction, "admin");

	}
	catch (error) {
		handleError(error);
	}

};

exports.config = {
	enabled: true,
	name: "help",
	setupRequired: true,
	requiredPermission: config.client.commands.permissions.admin,
	guildOnly: true,
	description: "List all the available commands",
	args: "",
	// Needed for legacy commands
	// maxArgs: 0,
};


async function sendHelpEmbed(client, interaction, permission) {
	const { container } = client;
	const arrayOfCommands = [];

	for (const cmd of container.slashCommands) {

		if (cmd[1].config.enabled) {
			const oneCommand = {};
			oneCommand.name = `${config.client.prefix}${cmd[1].config.name} ${cmd[1].config.args}`;
			oneCommand.value = codeBlock(cmd[1].config.description);
			arrayOfCommands.push(oneCommand);
		}

	}

	interaction.reply({ embeds: [await getStandardEmbed(`${config.client.name} | Help`, `Available commands for ${bold(permission)}:`, null, arrayOfCommands)], ephemeral: true });
}
