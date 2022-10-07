const { handleError } = require("../modules/errorHandling");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const config = require("../appconfig.js");
const { getWarningEmbed } = require("../bot-responses/embeds/warning");
const { getStandardEmbed } = require("../bot-responses/embeds/standard");

exports.run = async (client, interaction, permissions) => {
	try {
		await askForConfirmation(client, interaction);
	}
	catch (error) {
		handleError(error);
	}
};

exports.config = {
	enabled: true,
	name: "shutdown",
	setupRequired: true,
	requiredPermission: config.client.commands.permissions.admin,
	guildOnly: true,
	description: "Shut the bot permanently down",
	args: "",
	// Needed for legacy commands
	// maxArgs: 0,
};

async function askForConfirmation(client, interaction) {
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


		await interaction.editReply({
			embeds: [await getStandardEmbed(null, "Are you sure you want to shut down the bot?")],
			components: [buttons],
		});

		const collector = await interaction.channel.createMessageComponentCollector({
			componentType: ComponentType.Button,
			max: "1",
			time: config.client.commands.defaultAwaitTimer,
		});

		collector.on("collect", async (interaction) => {
			if (interaction.customId === "yes") {
				await interaction.deferUpdate();
				await sendResult(client, interaction, "yes");
			}

			if (interaction.customId === "no") {
				await interaction.deferUpdate();
				await sendResult(client, interaction, "no");
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

async function sendResult(client, interaction, answer) {
	try {

		switch (answer) {
		case "yes":
			await interaction.editReply({ embeds: [await getStandardEmbed(null, "Shutting the bot down...")], content: "", components: [] }).then(() => {
				client.destroy();
			});
			return process.exit(0);

		case "no":
			return await interaction.editReply({ embeds: [await getWarningEmbed(null, "Canceled the operation")], content: "", components: [] });
		}
	}
	catch (error) {
		handleError(error);
	}
}

