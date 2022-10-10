const config = require("../appconfig.js");
const { handleError } = require("../modules/errorHandling.js");
const db = require("../data/models/index.js");
const { getStandardEmbed } = require("../bot-responses/embeds/standard.js");
const { bold } = require("discord.js");
const { verifyChannel } = require("../modules/inputVerification.js");
const { getWarningEmbed } = require("../bot-responses/embeds/warning.js");

exports.run = async (client, interaction, permissions) => {

	try {
		await interaction.deferReply({ ephemeral: true, content: "Thinking..." });

		if (interaction.options.get("notification-channel")) {
			if (!await verifyChannel(interaction, interaction.options.get("notification-channel").channel)) {
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, "The selected notification-channel is not valid.")], ephemeral: true });
			}
		}


		if (interaction.options.get("greetings-channel")) {
			if (!await verifyChannel(interaction, interaction.options.get("greetings-channel").channel)) {
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, "The selected greetings-channel is not valid.")], ephemeral: true });
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
	try {
		const data = {
			guild_id: interaction.guild.id,
			admin_role: interaction.options.get("admin-role").value,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		if (interaction.options.getSubcommand() === "main") {
			data.is_main_server = true;
		}
		else {
			data.is_main_server = false;
		}

		if (interaction.options.get("guest-role")) {
			data.guest_role = interaction.options.get("guest-role").value;
		}
		else {
			data.guest_role = null;
		}

		if (interaction.options.get("student-role")) {
			data.student_role = interaction.options.get("student-role").value;
		}
		else {
			data.student_role = null;
		}

		if (interaction.options.get("batch-role")) {
			data.batch_role = interaction.options.get("batch-role").value;
		}
		else {
			data.batch_role = null;
		}

		if (interaction.options.get("notification-channel")) {
			data.notification_channel = interaction.options.get("notification-channel").value;
		}
		else {
			data.notification_channel = null;
		}

		if (interaction.options.get("greetings-channel")) {
			data.greetings_channel = interaction.options.get("greetings-channel").value;
		}
		else {
			data.greetings_channel = null;
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
	catch (error) {
		handleError(error);
	}
}

async function saveGuildData(data) {
	try {
		await db.sequelize.models.Guilds.create({
			id: data.guild_id,
			is_main_server: data.is_main_server,
			notification_channel: data.notification_channel,
			greetings_channel: data.greetings_channel,
			admin_role: data.admin_role,
			guest_role: data.guest_role,
			student_role: data.student_role,
			batch_role: data.batch_role,
			master_password: data.master_password,
			student_password: data.student_password,
			guest_password: data.guest_password,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		});

	}
	catch (error) {
		handleError(error);
	}

}

async function sendResponse(interaction) {
	try {
		await interaction.editReply({ embeds: [await getStandardEmbed(null, `Successfully completed setup. To view server settings: ${bold("/settings list")}`)], ephemeral: true });
	}
	catch (error) {
		handleError(error);
	}
}