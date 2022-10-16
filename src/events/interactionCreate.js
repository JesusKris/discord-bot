const { InteractionType } = require("discord.js");
const { getWarningEmbed } = require("../bot-responses/embeds/warning");
const { getUserPermissions, hasPermission } = require("../modules/permissions.js");
const { getGuildSettings } = require("../modules/guildSettings.js");

module.exports = async (client, interaction) => { // eslint-disable-line 

	if (interaction.type != InteractionType.ApplicationCommand) return;

	const { container } = client;

	// get cmd data
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


	const guildSettings = await getGuildSettings(interaction);
	const userPermissions = await getUserPermissions(guildSettings, interaction);


	// special case for setup -> owner -> not completed
	if (cmd.config.name == "setup" && !guildSettings && await hasPermission(userPermissions, cmd)) {
		return await cmd.run(client, interaction, userPermissions);
	}

	// special case for setup -> owner -> completed
	if (cmd.config.name == "setup" && guildSettings && await hasPermission(userPermissions, cmd)) {
		return await interaction.reply({ embeds: [await getWarningEmbed(null, "You have already completed setup in this server.")], ephemeral: true });
	}


	// if server owner
	if (cmd.config.setupRequired && !guildSettings && interaction.user.id === interaction.member.guild.ownerId) {
		return await interaction.reply({ embeds: [await getWarningEmbed(null, "You have not completed server setup yet.")], ephemeral: true });
	}

	// user
	if (cmd.config.setupRequired && !guildSettings) {
		return await interaction.reply({ embeds: [await getWarningEmbed(null, "The server owner has not completed setup process yet.")], ephemeral: true });
	}

	// if has permission
	if (await hasPermission(userPermissions, cmd)) {
		return await cmd.run(client, interaction, userPermissions);
	}

	return await interaction.reply({ embeds: [await getWarningEmbed(null, "You don't have permissions to use this command.")], ephemeral: true });
};