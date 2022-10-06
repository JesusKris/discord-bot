const config = require("../appconfig.js");
const { handleError } = require("../modules/errorHandling.js");
const { bold, codeBlock } = require("discord.js");
const { getStandardEmbed } = require("../bot-responses/embeds/standard");

exports.run = async (client, interaction, permissions) => {
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
	description: "This will give you all the available commands.",
	args: [""],
	maxArgs: 0,
};


async function sendHelpEmbed(client, interaction, permission) {
	const { container } = client;
	const arrayOfCommands = [];
	container.slashCommands.forEach((value, index) => {
		if (value.config.requiredPermission == permission && value.config.enabled) {
			const oneCommand = {};
			oneCommand.name = `${config.client.prefix}${value.config.name} ${value.config.args}`;
			oneCommand.value = codeBlock(value.config.description);
			arrayOfCommands.push(oneCommand);
		}
	});
	await interaction.reply({ embeds: [await getStandardEmbed(`${config.client.name} | Help`, `Available commands for ${bold(permission)}:`, null, arrayOfCommands)], ephemeral: true  });
}
