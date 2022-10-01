const { bold, roleMention, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const config = require("../appconfig.js");
const { getStandardEmbed } = require("../bot-responses/embeds/standard.js");
const { getWarningEmbed } = require("../bot-responses/embeds/warning.js");
const { handleError } = require("../modules/errorHandling.js");
const { getLogEmbed } = require("../bot-responses/embeds/log.js");

exports.run = async (client, interaction, permissions) => {
	try {

		const roleId = await interaction.options.get("role").value;
		const message = await interaction.options.getString("message");

		await sendExampleMessage(client, interaction, message, roleId);

		await askForConfirmation(client, interaction, message, roleId);

	}
	catch (error) {
		handleError(error);
	}
};

exports.config = {
	enabled: true,
	name: "dm",
	setupRequired: true,
	requiredPermission: config.client.commands.permissions.admin,
	guildOnly: true,
	description: "Tell bot to direct message people who have a role",
	args: ["<role> <message>"],
	maxArgs: 2,
};


async function sendExampleMessage(client, interaction, message, roleId) {
	try {

		const buttons = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId("no")
					.setLabel("Cancel!")
					.setEmoji("❌")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("yes")
					.setLabel("Yes!")
					.setEmoji("✅")
					.setStyle(ButtonStyle.Secondary),
			);

		await interaction.deferReply({ ephemeral: true, content: "Thinking..." });

		if (interaction.member.nickname) {
			await interaction.editReply({
				embeds: [await getLogEmbed(bold(`Message from ${interaction.member.nickname}`), message, null, null, { text: `From server ${interaction.member.guild.name}` })],
				content: `Are you sure you want to send this message to every person that has ${roleMention(roleId)} role?`,
				components: [buttons],
			});
		}
		else {
			await interaction.editReply({
				embeds: [await getLogEmbed(bold(`Message from ${interaction.member.user.username}`), message, null, null, { text: `From server ${interaction.member.guild.name}` })],
				content: `Are you sure you want to send this message to every person that has ${roleMention(roleId)} role?`,
				components: [buttons],

			});
		}
	}
	catch (error) {
		handleError(error);
	}
}

async function askForConfirmation(client, interaction, message, roleId) {
	try {


		const collector = await interaction.channel.createMessageComponentCollector({
			componentType: ComponentType.Button,
			max: "1",
			time: config.client.commands.defaultAwaitTimer,
		});

		collector.on("collect", async (interaction) => {
			if (interaction.customId === "yes") {
				await interaction.deferUpdate();
				await sendResult(client, interaction, "yes", message, roleId);
			}

			if (interaction.customId === "no") {
				await interaction.deferUpdate();
				await sendResult(client, interaction, "no", message, roleId);
			}

		});

		collector.on("end", async (collected) => {
			if (collected.size == 0) {
				await interaction.editReply({ embeds: [await getWarningEmbed(null, "Canceled the operation")], content: "", components: [] }); // Run a piece of code when the collector ends
			}
		});

	}
	catch (error) {
		handleError(error);
	}
}

async function sendResult(client, interaction, answer, message, roleId) {
	try {

		switch (answer) {
			case "yes":
				const members = await interaction.guild.members.fetch();

				let content;
				if (interaction.member.nickname) {
					content = {
						embeds: [await getLogEmbed(bold(`Message from ${interaction.member.nickname}`), message, null, null, { text: `From server ${interaction.member.guild.name}` })],
					};
				}
				else {
					content = {
						embeds: [await getLogEmbed(bold(`Message from ${interaction.member.user.username}`), message, null, null, { text: `From server ${interaction.member.guild.name}` })],
					};
				}

				let count = 0;


				members.forEach((member) => {
					if (member.roles.cache.has(roleId) && !member.user.bot) {
						member.send(content);
						count++;
					}
				});


				return await interaction.editReply({ embeds: [await getStandardEmbed(null, `Successfully sent the message to ${count} users:\n\n${message}`)], content: "", components: [] });

			case "no":
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, "Canceled the operation")], content: "", components: [] });
		}
	}
	catch (error) {
		handleError(error);
	}
}