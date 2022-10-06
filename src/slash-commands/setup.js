const config = require("../appconfig.js");
const { handleError } = require("../modules/errorHandling.js");
const db = require("../data/models/index.js");
const { getStandardEmbed } = require("../bot-responses/embeds/standard.js");

exports.run = async (client, interaction, permissions) => {

	try {
		await interaction.deferReply({ ephemeral: true, content: "Thinking..." });

		const data = await prepareGuildData(interaction);

		await saveGuildData(data);

		await sendResponse(interaction);
	}
	catch (error) {
		handleError(error)
	}
};

exports.config = {
	enabled: true,
	name: "setup",
	setupRequired: true,
	requiredPermission: config.client.commands.permissions.guildOwner,
	guildOnly: true,
	description: "This will setup the bot in the server",
	args: [""],
	maxArgs: 2,
};

async function prepareGuildData(interaction) {
	try {
		const data = {
			guild_id: interaction.guild.id,
			admin_role: interaction.options.get("admin-role").value,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		if (interaction.options.getString("type") == "main") {
			data.is_main_server = true
		} else {
			data.is_main_server = false
		}

		if (interaction.options.get("guest-role")) {
			data.guest_role = interaction.options.get("guest-role").value
		} else {
			data.guest_role = null
		}

		if (interaction.options.get("student-role")) {
			data.student_role = interaction.options.get("student-role").value
		} else {
			data.student_role = null
		}

		if (interaction.options.get("batch-role")) {
			data.batch_role = interaction.options.get("batch-role").value
		} else {
			data.batch_role = null
		}

		if (interaction.options.get("notification-channel")) {
			data.notification_channel = interaction.options.get("notification-channel").value
		} else {
			data.notification_channel = null
		}

		if (interaction.options.get("greetings-channel")) {
			data.greetings_channel = interaction.options.get("greetings-channel").value
		} else {
			data.greetings_channel = null
		}
		return data
	}
	catch (error) {
		handleError(error)
	}
}

async function saveGuildData(data) {
	try {
		await db.sequelize.models.Guilds.create({
			guild_id: data.guild_id,
			is_main_server: data.is_main_server,
			notification_channel: data.notification_channel,
			greetings_channel: data.greetings_channel,
			admin_role: data.admin_role,
			guest_role: data.guest_role,
			student_role: data.student_role,
			batch_role: data.batch_role,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt
		})
	}
	catch (error) {
		handleError(error)
	}

}

async function sendResponse(interaction) {
	try {
		await interaction.editReply({ embeds: [await getStandardEmbed(null, "Successfully completed setup")] });
	}
	catch (error) {
		handleError(error)
	}
}