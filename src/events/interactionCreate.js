const { InteractionType } = require("discord.js");
const { getWarningEmbed } = require("../bot-responses/embeds/warning");
const { handleError } = require("../modules/errorHandling");
const { getUserPermissions } = require("../modules/permissions.js");
const { getGuildSettings, noPermissionsInteraction } = require("../modules/utils");

module.exports = async (client, interaction) => { // eslint-disable-line 

	if (interaction.type != InteractionType.ApplicationCommand) return;

	const { container } = client;

	// Grab the command data from the client.container.slashcmds Collection
	const cmd = await container.slashCommands.get(interaction.commandName);

	// If that command doesn't exist, silently exit and do nothing
	if (!cmd) return;

	if (cmd && !interaction.inGuild() && cmd.config.guildOnly) {
		return await interaction.reply({ embeds: [await getWarningEmbed(null, "This command is only available in a server.")], ephemeral: true });

	}

	// check if enabled
	if (!cmd.config.enabled) {
		return await interaction.reply({ embeds: [await getWarningEmbed(null, "This command is currently disabled.")], ephemeral: true });

	}

	const guildSettings = await getGuildSettings(interaction.member);
	const userPermissions = await getUserPermissions(guildSettings, interaction);

	if (cmd.config.setupRequired && guildSettings == null) {
		return await interaction.reply({ embeds: [await getWarningEmbed(null, "The server owner has not completed setup process yet!")], ephemeral: true });
	}

	if (userPermissions.includes(cmd.config.requiredPermission)) {
		try {
			await cmd.run(client, interaction, userPermissions);
		}
		catch (error) {
			handleError(error);
		}
	}
	else {
		noPermissionsInteraction(interaction);
	}

};