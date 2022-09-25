const { InteractionType } = require("discord.js");
const { getWarningEmbed } = require("../bot-responses/embeds/warning");
const { handleError } = require("../modules/errorHandling");
const { getUserPermissions } = require("../modules/permissions.js");
const { getGuildSettings } = require("../modules/guildSettings.js");

module.exports = async (client, interaction) => { // eslint-disable-line 

	if (interaction.type != InteractionType.ApplicationCommand) return;

	const { container } = client;

	// Grab the cmd data from the client.container.slashCommands Collection
	const cmd = await container.slashCommands.get(interaction.commandName);

	// If cmd doesn't exist
	if (!cmd) return;

	// if cmd is called outside of guild chat
	if (cmd && !interaction.inGuild() && cmd.config.guildOnly) {
		return await interaction.reply({ embeds: [await getWarningEmbed(null, "This command is only available in a server.")], ephemeral: true });
	}

	// if enabled
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
		return await interaction.reply({ embeds: [await getWarningEmbed(null, "You don't have permission to use this command!")], ephemeral: true });
	}

};