const config = require("../appconfig.js");
const { handleError } = require("../modules/errorHandling.js");
const db = require("../data/models/index.js");
const { getStandardEmbed } = require("../bot-responses/embeds/standard.js");
const { bold, channelMention, roleMention, MessageMentions: { ChannelsPattern, RolesPattern, UsersPattern, EveryonePattern } } = require("discord.js");
const { getGuildSettings } = require("../modules/guildSettings.js");
const { getWarningEmbed } = require("../bot-responses/embeds/warning.js");
const { getRawId } = require("../modules/utils.js");

exports.run = async (client, interaction, permissions) => {
	try {
		const settings = await getGuildSettings(interaction);

		await deleteUnWantedEntries(settings);

		if (interaction.options.getSubcommand() === "list") {
			await sendSettings(interaction, settings);
		}

		if (interaction.options.getSubcommand() === "change") {
			const setting = interaction.options.getString("setting");
			const input = interaction.options.getString("value");

			await validateInput(interaction, setting, input);

		}

	}
	catch (error) {
		handleError(error);
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
	// Needed for legacy commands
	// maxArgs: 0,
};

async function deleteUnWantedEntries(setting) {
	delete setting.id;
	delete setting.is_main_server;
	delete setting.createdAt;
	delete setting.updatedAt;
}

async function sendSettings(interaction, settings) {
	try {
		const arrayOfCommands = [];
		for (const [key, value] of Object.entries(settings)) {

			const oneSetting = {};
			if (value != null) {
				oneSetting.name = key;

				//channel
				if (key === "notification_channel" || key === "greetings_channel") {
					oneSetting.value = channelMention(value);
				}
				//role
				else if (key === "admin_role" || key === "guest_role" || key === "student_role" || key === "batch_role") {
					oneSetting.value = roleMention(value);
				}
				//text
				else {
					oneSetting.value = value;
				}

			}
			else {
				oneSetting.name = key;
				oneSetting.value = "-";
			}

			arrayOfCommands.push(oneSetting);
		}

		await interaction.reply({ embeds: [await getStandardEmbed(`Settings in ${bold(interaction.guild.name)}`, null, null, arrayOfCommands)], ephemeral: true });
	}
	catch (error) {
		handleError(error);
	}
}

async function validateInput(interaction, setting, input) {

	if (setting == "notification_channel" || setting == "greetings_channel") {

		if (input.match(ChannelsPattern) || input == "null") {
			const channelId = await getRawId(input);

			changeSetting(interaction, setting, channelId);
			sendResponse(interaction, true);
		}
		else {
			sendResponse(interaction, false);
		}


	}

	if (setting == "admin_role" || setting == "guest_role" || setting == "student_role" || setting == "batch_role") {
		if (input.match(RolesPattern)) {
			const roleId = await getRawId(input)




			changeSetting(interaction, setting, roleId);
			sendResponse(interaction, true);
		}
		else {
			sendResponse(interaction, false);
		}
	}


	if (setting == "master_password" || setting == "student_password" || setting == "guest_password") {

		if (!input.match(ChannelsPattern) && !input.match(RolesPattern) && !input.match(UsersPattern) && !input.match(EveryonePattern)) {
			changeSetting(interaction, setting, input);
			sendResponse(interaction, true);
		}
		else {
			sendResponse(interaction, false);
		}

	}
}

async function changeSetting(interaction, setting, input) {

	if (input == "null") {
		input = null;
	}

	try {
		await db.sequelize.models.Guilds.update({ [`${setting}`]: input }, {
			where: {
				id: interaction.guild.id,
			},
		});
	}
	catch (error) {
		handleError(error);
	}

}

async function sendResponse(interaction, isCorrect) {
	if (isCorrect) {
		await interaction.reply({ embeds: [await getStandardEmbed(null, "Setting changed successfully")], ephemeral: true });
	}
	else {
		await interaction.reply({ embeds: [await getWarningEmbed(null, `Wrong input provided. Please check if the setting requires a ${bold("channel")}/${bold("role")} or ${bold("text")}!`)], ephemeral: true });
	}
}