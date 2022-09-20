const config = require('../appconfig.js');
const { handleError } = require('../modules/errorHandling.js');
const { noPermissionsInteraction } = require('../modules/utils.js');
const {bold, codeBlock} = require('discord.js');
const { getStandardEmbed } = require('../bot-responses/embeds/standard');
const { defaultPermission } = require('../modules/permissions.js');

exports.run = async (client, interaction, permissions) => {

	try {
		const option = await interaction.options.getString('category');

		if (!option) {
			return sendHelpEmbed(client, interaction, await defaultPermission());
		}

		if (!permissions.includes(option)) { // you'd have to properly format the thing to match here
			return noPermissionsInteraction(interaction);
		}

		return sendHelpEmbed(client, interaction, option);

	}
	catch (error) {
		handleError(client, error);
	}

};

exports.config = {
	enabled: true,
	name: 'help',
	setupRequired: true,
	requiredPermission: config.client.commands.permissions.user,
	guildOnly: true,
	description: 'This will give you all the available commands.\n\nE: !help admin',
	args: ['[admin, developer]'],
	maxArgs: 1,
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
	await interaction.reply({ embeds: [await getStandardEmbed(`${config.client.name} | Help`, `Available commands for ${bold(permission)}:`, arrayOfCommands)] });
}
