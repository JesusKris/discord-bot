const { bold, roleMention, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const config = require("../appconfig.js");
const { getStandardEmbed } = require("../bot-responses/embeds/standard.js");
const { getWarningEmbed } = require("../bot-responses/embeds/warning.js");
const { handleError } = require("../modules/errorHandling.js");
const { getLogEmbed } = require("../bot-responses/embeds/log.js");

exports.run = async (client, interaction, permissions) => { // eslint-disable-line

	const roleId = await interaction.options.get("role").value;
	const message = await interaction.options.getString("message");

	await interaction.deferReply({ ephemeral: true, content: "Thinking..." });

	await sendExampleMessage(interaction, message, roleId);

	await askForConfirmation(interaction, message, roleId);

};

exports.config = {
	enabled: true,
	name: "dm",
	setupRequired: true,
	requiredPermission: config.client.commands.permissions.admin,
	guildOnly: true,
	description: "Direct message people who have specific role",
	args: "<role> <message>",
	// Needed for legacy commands
	// maxArgs: 0,
};


async function sendExampleMessage(interaction, message, roleId) {

	const buttons = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId("no")
				.setLabel("Cancel")
				.setEmoji("❌")
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId("yes")
				.setLabel("Yes")
				.setEmoji("✅")
				.setStyle(ButtonStyle.Secondary),
		);

	try {
		await interaction.editReply({
			embeds: [await getLogEmbed(bold(`Message from ${interaction.member.nickname ?? interaction.member.user.username}`), message, null, null, { text: `From server ${interaction.member.guild.name}` })],
			content: `Are you sure you want to send this message to every person that has ${roleMention(roleId)} role?`,
			components: [buttons],
			ephemeral: true,
		});
	}
	catch (error) {
		handleError(error);
	}
}

async function askForConfirmation(interaction, message, roleId) {
	try {
		const collector = await interaction.channel.createMessageComponentCollector({
			componentType: ComponentType.Button,
			max: "1",
			time: config.client.commands.defaultAwaitTimer,
		});

		// buttons interaction
		collector.on("collect", async (int) => {
			if (int.customId === "yes") {
				await int.deferUpdate();
				return sendResult(int, "yes", message, roleId);
			}

			if (int.customId === "no") {
				await int.deferUpdate();
				return sendResult(int, "no", message, roleId);
			}

		});

		collector.on("end", async (collected) => {
			// no input
			if (collected.size == 0) {
				await interaction.editReply({ embeds: [await getWarningEmbed(null, "Canceled the operation.")], content: "", components: [], ephemeral: true });
			}
		});

	}
	catch (error) {
		handleError(error);
	}
}

async function sendResult(interaction, answer, message, roleId) {
	try {
		switch (answer) {
		case "yes":
			const members = await interaction.guild.members.fetch();

			const content = {
				embeds: [await getLogEmbed(bold(`Message from ${interaction.member.nickname ?? interaction.member.user.username}`), message, null, null, null, { text: `From server ${interaction.member.guild.name}` })],
			};

			let count = 0;

			for (const member of members) {
				if (member[1].roles.cache.has(roleId) && !member[1].user.bot) {
					try {
						await member[1].send(content);
						count++;
					}
					catch { }
				}
			}


			let finalMessage;
			if (count == 0) {
				finalMessage = "There were no users available with the selected role.";
			}

			if (count == 1) {
				finalMessage = `Successfully sent the message to ${count} user:\n\n${finalMessage}`;
			}

			if (count > 1) {
				finalMessage = `Successfully sent the message to ${count} users:\n\n${finalMessage}`;
			}

			return await interaction.editReply({ embeds: [await getStandardEmbed(null, finalMessage)], content: "", components: [], ephemeral: true });

		case "no":
			return await interaction.editReply({ embeds: [await getWarningEmbed(null, "Canceled the operation.")], content: "", components: [], ephemeral: true });
		}
	}
	catch (error) {
		handleError(error);
	}
}