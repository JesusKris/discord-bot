const { handleError } = require('../modules/errorHandling');
const config = require('../appconfig.js');
const { getWarningEmbed } = require('../bot-responses/embeds/warning');
const { getStandardEmbed } = require('../bot-responses/embeds/standard');

exports.run = async (client, interaction, permissions) => {
	try {
		await sendConfirmationMessage(client, interaction)
		
		const answer = await askForConfirmation(client, interaction)

		if (answer) {
			await sendResult(client, interaction, answer)
		}



	}
	catch (error) {
		handleError(error)
	}
};

exports.config = {
	enabled: true,
	name: 'shutdown',
	setupRequired: true,
	requiredPermission: config.client.commands.permissions.developer,
	guildOnly: true,
	description: 'This will shutdown the bot.\n\nE: !help admin',
	args: [''],
	maxArgs: 0,
};

async function sendConfirmationMessage(client, interaction) {
	try {
		await interaction.deferReply({ ephemeral: true, content: 'Thinking...' });
		await interaction.editReply({
			content: `Are you sure you want to shut down the bot? yes/no`,
		});
	}
	catch (error) {
		handleError(error);
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
		handleError(error);
	}
}

async function sendResult(client, interaction, answer) {
	try {

		switch (answer.first().content) {
			case 'yes':
				answer.first().delete();
				await interaction.editReply({ embeds: [await getStandardEmbed(null, `Shutting the bot down...`)], content: '' }).then(() => {
					client.destroy()
				})
				process.exit(0)

			case 'no':
				answer.first().delete();
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, 'Canceled the operation')], content: '' });
		}
	}
	catch (error) {
		handleError(error);
	}
}

