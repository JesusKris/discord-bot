const { getStandardEmbed } = require("../bot-responses/embeds/standard.js");
const { handleError } = require("../modules/errorHandling.js");
const logger = require("../modules/logger.js");
const { bold } = require("discord.js");

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
		await user.send({ embeds: [await getStandardEmbed("A bird whispers:", await getIntroductionMessage(client))] });

	}
	catch (error) {
		handleError(error);
	}
}

async function getIntroductionMessage(client) {

	try {
		return `"Hey! My name is Robert. To awaken ${bold(config.client.name)}, you must type ${bold(`${config.client.prefix}setup`)} in any channel.\n\n Don't mess this up!"`;
	}
	catch (error) {
		handleError(error);
	}
}