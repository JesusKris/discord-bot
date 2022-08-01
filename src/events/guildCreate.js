const { getStandardEmbed } = require('../bot-responses/embeds/standard.js');
const { getIntroductionMessage } = require('../bot-responses/messages/introduction.js');
const { handleError } = require('../modules/errorHandling.js');
const logger = require('../modules/logger.js');

module.exports = async (client, guild) => {
	logger.guild(`${guild.name}, (id:${guild.id}) added the client.`);

	try {
		await sendIntroductionsToOwner(client, guild);
	}
	catch (error) {
		handleError(client, error);
	}

};

async function sendIntroductionsToOwner(client, guild) {
	try {

		const user = await guild.members.fetch(guild.ownerId);
		await user.send({ embeds: [await getStandardEmbed('A bird whispers:', await getIntroductionMessage(client))] });

	}
	catch (error) {
		handleError(client, error);
	}
}