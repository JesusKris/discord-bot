const { handleError } = require('../modules/errorHandling');
const config = require('../appconfig.js');
const { getWarningEmbed } = require('../bot-responses/embeds/warning');
const { getStandardEmbed } = require('../bot-responses/embeds/standard');
const { initApp } = require('../engine');
const { sleep } = require('../modules/utils');


exports.run = async (client, interaction, permissions) => {

	try {
		await sendConfirmationMessage(client, interaction)

		const answer = await askForConfirmation(client, interaction)

		if (answer) {
			return await sendResult(client, interaction, answer)
		}



	}
	catch (error) {
		handleError(client, error)
	}
};

exports.config = {
	enabled: true,
	name: 'restart',
	setupRequired: true,
	requiredPermission: config.client.commands.permissions.developer,
	guildOnly: true,
	description: 'This will restart the bot.\n\nE: !help admin',
	args: ['<reason>'],
	maxArgs: 1,
};

async function sendConfirmationMessage(client, interaction) {
	try {
		await interaction.deferReply({ ephemeral: true, content: 'Thinking...' });
		await interaction.editReply({
			content: `Are you sure you want to restart the bot? yes/no`,
		});
	}
	catch (error) {
		handleError(client, error);
	}
}

async function askForConfirmation(client, interaction) {
	try {

		const filter = m => m.content === 'yes' || m.content === 'no';
		const answer = await interaction.channel.awaitMessages({
			filter: filter,
			max: 1,
			time: config.client.commands.defaultAwaitTimer,
			errors: ['time'],

		}).catch(async () => {
			interaction.editReply({ embeds: [await getWarningEmbed(null, 'No correct response received.. canceling.')], content: '' });
		});

		return answer;

	}
	catch (error) {
		handleError(client, error);
	}
}

async function sendResult(client, interaction, answer) {
	try {

		switch (answer.first().content) {
			case 'yes':
				answer.first().delete();
				await interaction.editReply({ embeds: [await getStandardEmbed(null, `Restarting the bot...`)], content: '' })

				await client.destroy()

				await sleep(3000)
				await initApp()
				return
	
			case 'no':
				answer.first().delete();
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, 'Canceled the operation')], content: '' });
		}
	}
	catch (error) {
		handleError(client, error);
	}
}