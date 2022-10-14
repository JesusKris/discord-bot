const config = require("../appconfig.js");
const { handleError } = require("../modules/errorHandling.js");
const db = require("../data/models/index.js");
const { getStandardEmbed } = require("../bot-responses/embeds/standard.js");
const { bold, channelMention, roleMention, MessageMentions: { ChannelsPattern, RolesPattern, UsersPattern, EveryonePattern } } = require("discord.js");
const { getGuildSettings } = require("../modules/guildSettings.js");
const { getWarningEmbed } = require("../bot-responses/embeds/warning.js");
const { getRawId } = require("../modules/utils.js");

exports.run = async (client, interaction, permissions) => { // eslint-disable-line
	try {
		if (interaction.options.getSubcommand() === "list") {
			const settings = await getGuildData(interaction);
			await sendSettings(interaction, settings);
		}

		if (interaction.options.getSubcommand() === "change") {
			const setting = interaction.options.getString("setting");
			const input = interaction.options.getString("value");

			const isAvailable = await checkAvailableSetting(interaction, setting);

			if (!isAvailable) {
				return await interaction.reply({ embeds: [await getWarningEmbed(null, "This setting is not available in a sprint server.")], ephemeral: true });
			}

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

async function getGuildData(interaction) {
	try {
		const data = await db.sequelize.models.Guilds.findByPk(interaction.guild.id, {
			attributes: ["is_main"],
			raw: true,
		});

		let settings;
		if (data.is_main) {
			settings = await db.sequelize.models.Guilds.findByPk(interaction.guild.id, {
				attributes: { exclude: ["id", "created_at", "updated_at", "is_main"] },
				raw: true,
			});
		}

		if (!data.is_main) {
			settings = await db.sequelize.models.Guilds.findByPk(interaction.guild.id, {
				attributes: ["notification_channel", "greetings_channel", "admin_role"],
				raw: true,
			});
		}

		return settings;

	}
	catch (error) {
		handleError(error);
	}
}


async function sendSettings(interaction, settings) {
	try {
		const arrayOfSettings = [];
		for (const [key, value] of Object.entries(settings)) {

			const oneSetting = {};
			if (value) {
				oneSetting.name = key;

				// channel
				if (key === "notification_channel" || key === "greetings_channel") {
					oneSetting.value = channelMention(value);
				}
				// role
				else if (key === "admin_role" || key === "guest_role" || key === "student_role" || key === "batch_role") {
					oneSetting.value = roleMention(value);
				}
				// text
				else {
					oneSetting.value = value;
				}

			}
			else {
				oneSetting.name = key;
				oneSetting.value = "-";
			}

			arrayOfSettings.push(oneSetting);
		}

		await interaction.reply({ embeds: [await getStandardEmbed(`Settings in ${bold(interaction.guild.name)}`, null, null, arrayOfSettings)], ephemeral: true });
	}
	catch (error) {
		handleError(error);
	}
}

async function validateInput(interaction, setting, input) {

	if (setting == "notification_channel" || setting == "greetings_channel") {

		if (input.match(ChannelsPattern) || input == "Disable") {

			let channel;
			if (input == "Disable") {
				channel = null;
			}
			else {
				channel = await getRawId(input);
			}

			changeSetting(interaction, setting, channel);
			return sendResponse(interaction, true);
		}
		return sendResponse(interaction, false);

	}

	if (setting == "admin_role" || setting == "guest_role" || setting == "student_role" || setting == "batch_role") {
		if (input.match(RolesPattern)) {
			const roleId = await getRawId(input);

			// checking if the selected role is not being used as react role
			const notReactRole = await checkForReactRole(interaction, roleId);

			if (!notReactRole) {
				return await interaction.reply({
					embeds: [await getWarningEmbed(null, "The selected role is being used as a react-role. Please remove it to select it.")], ephemeral: true,
				});
			}

			changeSetting(interaction, setting, roleId);
			return sendResponse(interaction, true);
		}
		return sendResponse(interaction, false);

	}


	if (setting == "master_password" || setting == "student_password" || setting == "guest_password") {

		if (!input.match(ChannelsPattern) && !input.match(RolesPattern) && !input.match(UsersPattern) && !input.match(EveryonePattern)) {
			changeSetting(interaction, setting, input);
			return sendResponse(interaction, true);
		}

		return sendResponse(interaction, false);
	}
}

async function changeSetting(interaction, setting, input) {
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
		await interaction.reply({ embeds: [await getStandardEmbed(null, "Setting changed successfully.")], ephemeral: true });
	}
	else {
		await interaction.reply({ embeds: [await getWarningEmbed(null, `Wrong input provided. Please check if the setting requires a ${bold("channel")}, ${bold("role")} or ${bold("text")}.`)], ephemeral: true });
	}
}

async function checkAvailableSetting(interaction, setting) {
	try {
		const settings = await getGuildSettings(interaction);

		if (!settings.is_main) {
			if (setting == "admin_role" || setting == "notification_channel" || setting == "greetings_channel") {
				return true;
			}
			return false;
		}

		return true;
	}
	catch (error) {
		handleError(error);
	}
}


async function checkForReactRole(interaction, roleId) {
	try {
		const result = await db.sequelize.models.R_Role_Reactions.findOne({
			where: {
				guild_id: interaction.guild.id,
				role: roleId,
			},
			raw: true,
		});

		return result
	}
	catch (error) {
		handleError(error);
	}
}