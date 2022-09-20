const { bold, roleMention, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../appconfig.js');
const { getStandardEmbed } = require('../bot-responses/embeds/standard.js');
const { getWarningEmbed } = require('../bot-responses/embeds/warning.js');
const { handleError } = require('../modules/errorHandling.js');
const { getLogEmbed } = require('../bot-responses/embeds/log.js');

exports.run = async (client, interaction, permissions) => {
	try {

		const roleId = await interaction.options.get('role').value;
		const message = await interaction.options.getString('message');

		await sendExampleMessage(client, interaction, message, roleId);


		await askForConfirmation(client, interaction);

	}
	catch (error) {
		handleError(error);
	}
};

exports.config = {
	enabled: true,
	name: 'dm',
	setupRequired: true,
	requiredPermission: config.client.commands.permissions.admin,
	guildOnly: true,
	description: 'Tell bot to direct message',
	args: ['<role> <message>'],
	maxArgs: 2,
};


async function sendExampleMessage(client, interaction, message, roleId) {
	try {

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('primary')
					.setLabel('Click me!')
					.setStyle(ButtonStyle.Primary),
			);

		await interaction.deferReply({ ephemeral: true, content: 'Thinking...' });
		if (interaction.member.nickname) {
			await interaction.editReply({
				embeds: [await getLogEmbed(bold(`Message from ${interaction.member.nickname}`), message, [], { text: `From server ${interaction.member.guild.name}` })],
				content: `Are you sure you want to send this message to every person that has ${roleMention(roleId)} role? yes/no`,
				components: [row]
			});
		} else {
			await interaction.editReply({
				embeds: [await getLogEmbed(bold(`Message from ${interaction.member.user.username}`), message, [], { text: `From server ${interaction.member.guild.name}` })],
				content: `Are you sure you want to send this message to every person that has ${roleMention(roleId)} role? yes/no`,

			});
		}
	}
	catch (error) {
		handleError(error);
	}
}

async function askForConfirmation(client, interaction) {
	try {

		const collector = interaction.channel.createMessageComponentCollector({
			max: "1", // The number of times a user can click on the button
			time: "10000", // The amount of time the collector is valid for in milliseconds,	
		});

		collector.on("collect", (interaction) => {
			if (interaction.customId === "primary") {
				interaction.update("Clicked!"); // Run a piece of code when the user clicks on the button
			}
		});

		collector.on("end", async (collected) => {
			if (collected.size == 0) {
				await interaction.editReply({ embeds: [await getWarningEmbed(null, 'Canceled the operation')], content: '', components: [] }); // Run a piece of code when the collector ends
			}
		});

		/* const filter = m => m.content === 'yes' || m.content === 'no';
		const answer = await interaction.channel.awaitMessages({
			filter: filter,
			max: 1,
			time: config.client.commands.defaultAwaitTimer,
			errors: ['time'],

		}).catch(async () => {
			interaction.editReply({ embeds: [await getWarningEmbed(null, 'No correct response received.. canceling.')], content: '' });
		});

		return answer;
 */
	}
	catch (error) {
		handleError(error);
	}
}

async function sendResult(client, interaction, answer, message, roleId) {
	try {

		switch (answer.first().content) {
			case 'yes':
				const members = await interaction.guild.members.fetch();

				let content;
				if (interaction.member.nickname) {
					content = {
						embeds: [await getLogEmbed(bold(`Message from ${interaction.member.nickname}`), message, [], { text: `From server ${interaction.member.guild.name}` })],
					};
				} else {
					content = {
						embeds: [await getLogEmbed(bold(`Message from ${interaction.member.user.username}`), message, [], { text: `From server ${interaction.member.guild.name}` })],
					};
				}

				let count = 0;


				members.forEach((member) => {
					if (member.roles.cache.has(roleId) && !member.user.bot) {
						member.send(content);
						count++;
					}
				});


				answer.first().delete();
				return await interaction.editReply({ embeds: [await getStandardEmbed(null, `Successfully sent the message to ${count} users.`)], content: '' });

			case 'no':
				answer.first().delete();
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, 'Canceled the operation')], content: '' });
		}
	}
	catch (error) {
		handleError(error);
	}
}