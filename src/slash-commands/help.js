const { handleError } = require("../modules/errorHandling.js");
const { codeBlock } = require("discord.js");
const { getStandardEmbed } = require("../bot-responses/embeds/standard");
const config = require("../appconfig.js");


exports.run = async (client, interaction, permissions) => { // eslint-disable-line
	try {
		return await sendHelpEmbed(client, interaction);
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


async function sendHelpEmbed(client, interaction) {
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

	await interaction.reply({ embeds: [await getStandardEmbed(`${client.user.username} | Help`, "Available commands:", null, arrayOfCommands)], ephemeral: true });
}
