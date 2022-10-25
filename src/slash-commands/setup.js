const config = require("../appconfig.js");
const { handleError } = require("../modules/errorHandling.js");
const db = require("../data/models/index.js");
const { getStandardEmbed } = require("../bot-responses/embeds/standard.js");
const { bold } = require("discord.js");
const { verifyChannel, isEveryoneRole, isUserMention, isRoleMention, isChannelMention, isBotRole } = require("../modules/inputVerification.js");
const { getWarningEmbed } = require("../bot-responses/embeds/warning.js");

exports.run = async (client, interaction, permissions) => { // eslint-disable-line
	try {

		await interaction.deferReply({ ephemeral: true, content: "Thinking..." });

		if (await isEveryoneRole(interaction.options.get("admin-role").role.name)) {
			return await interaction.editReply({ embeds: [await getWarningEmbed(null, "Everyone role can't be selected as a setting.")], ephemeral: true });
		}

		if (await isBotRole(interaction.options.get("admin-role").role)) {
			return await interaction.editReply({ embeds: [await getWarningEmbed(null, "Bot role that is managed by the bot can't be selected as a setting.")], ephemeral: true });
		}


		// -> /setup main
		if (interaction.options.get("master-password")) {

			// @everyone not allowed
			if (await isEveryoneRole(interaction.options.get("student-role").role.name) || await isEveryoneRole(interaction.options.get("batch-role").role.name) || await isEveryoneRole(interaction.options.get("guest-role").role.name) || await isEveryoneRole(interaction.options.get("master-password").value) || await isEveryoneRole(interaction.options.get("student-password").value) || await isEveryoneRole(interaction.options.get("guest-password").value)) {
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, "Everyone role can't be selected as a setting.")], ephemeral: true });
			}


			// managed by bot role
			if (await isBotRole(interaction.options.get("student-role").role) || await isBotRole(interaction.options.get("batch-role").role) || await isBotRole(interaction.options.get("guest-role").role)) {
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, "Bot role that is managed by the bot can't be selected as a setting.")], ephemeral: true });
			}


			// -> passwords
			// roles
			if (await isRoleMention(interaction.options.get("master-password").value) || await isRoleMention(interaction.options.get("guest-password").value) || await isRoleMention(interaction.options.get("student-password").value)) {
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, "Passwords can't contain a role.")], ephemeral: true });
			}


			// usermentions
			if (await isUserMention(interaction.options.get("master-password").value) || await isUserMention(interaction.options.get("guest-password").value) || await isUserMention(interaction.options.get("student-password").value)) {
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, "Passwords can't contain users.")], ephemeral: true });
			}


			// channels
			if (await isChannelMention(interaction.options.get("master-password").value) || await isChannelMention(interaction.options.get("guest-password").value) || await isChannelMention(interaction.options.get("student-password").value)) {
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, "Passwords can't contain a channel.")], ephemeral: true });
			}
		}


		if (interaction.options.get("notification-channel")) {
			if (!await verifyChannel(interaction, interaction.options.get("notification-channel").channel)) {
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, "The selected notification channel is not valid.")], ephemeral: true });
			}
		}


		if (interaction.options.get("greetings-channel")) {
			if (!await verifyChannel(interaction, interaction.options.get("greetings-channel").channel)) {
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, "The selected greetings channel is not valid.")], ephemeral: true });
			}
		}


		const data = await prepareGuildData(interaction);

		await saveGuildData(data);

		await sendResponse(interaction);
	}
	catch (error) {
		handleError(error);
	}
};

exports.config = {
	enabled: true,
	name: "setup",
	setupRequired: true,
	requiredPermission: config.client.commands.permissions.guildOwner,
	guildOnly: true,
	description: "Set the bot up in the server",
	args: "<main> <sprint>",
	// Needed for legacy commands
	// maxArgs: 0,
};

async function prepareGuildData(interaction) {
	const data = {
		guild_id: interaction.guild.id,
		admin_role: interaction.options.get("admin-role").value,
		is_main: false,
		guest_role: null,
		batch_role: null,
		student_role: null,
		notification_channel: null,
		greetings_channel: null,
		created_at: new Date(),
		updated_at: new Date(),
	};

	if (interaction.options.getSubcommand() === "main") {
		data.is_main = true;
	}

	if (interaction.options.get("guest-role")) {
		data.guest_role = interaction.options.get("guest-role").value;
	}


	if (interaction.options.get("student-role")) {
		data.student_role = interaction.options.get("student-role").value;
	}


	if (interaction.options.get("batch-role")) {
		data.batch_role = interaction.options.get("batch-role").value;
	}


	if (interaction.options.get("notification-channel")) {
		data.notification_channel = interaction.options.get("notification-channel").value;
	}


	if (interaction.options.get("greetings-channel")) {
		data.greetings_channel = interaction.options.get("greetings-channel").value;
	}


	if (interaction.options.get("master-password")) {
		data.master_password = interaction.options.get("master-password").value;
	}

	if (interaction.options.get("student-password")) {
		data.student_password = interaction.options.get("student-password").value;
	}

	if (interaction.options.get("guest-password")) {
		data.guest_password = interaction.options.get("guest-password").value;
	}

	return data;

}


async function saveGuildData(data) {
	try {
		await db.sequelize.models.Guilds.create({
			id: data.guild_id,
			is_main: data.is_main,
			notification_channel: data.notification_channel,
			greetings_channel: data.greetings_channel,
			admin_role: data.admin_role,
			guest_role: data.guest_role,
			student_role: data.student_role,
			batch_role: data.batch_role,
			master_password: data.master_password,
			student_password: data.student_password,
			guest_password: data.guest_password,
			created_at: data.created_at,
			updated_at: data.updated_at,
		});

	}
	catch (error) {
		handleError(error);
	}

}

async function sendResponse(interaction) {
	interaction.editReply({ embeds: [await getStandardEmbed(null, `Successfully completed setup. To view server settings: ${bold("/settings list")}.`)], ephemeral: true });
}