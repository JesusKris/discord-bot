const { getGuildSettings } = require("../modules/guildSettings.js");
const { handleError } = require("../modules/errorHandling.js");
const { getStandardEmbed } = require("../bot-responses/embeds/standard.js");
const { userMention } = require("discord.js");
const { shuffleArray } = require("../modules/utils.js");

module.exports = async (client, member) => { // eslint-disable-line

	try {
		if (member.user.bot) return;

		const settings = await getGuildSettings(member);

		// setup done || notifications !disabled
		if (settings != null && settings.notification_channel != null) {
			const channel = await member.guild.channels.cache.get(settings.notification_channel);

			channel.send(
				{
					embeds: [await getStandardEmbed("A member has joined the server!", `Username: ${userMention(member.user.id)}`, { url: member.user.displayAvatarURL({ dynamic: true }) })],
				},
			);
		}

		// setup done || greetings !disabled
		if (settings != null && settings.greetings_channel != null && !settings.is_main_server) {
			const channel = await member.guild.channels.cache.get(settings.greetings_channel);
			channel.send(await getGreetingMessage(member));
		}
	}
	catch (error) {
		handleError(error);
	}
};


async function getGreetingMessage(member) {
	const greetings = [
		`Everybody welcome to sprint ${userMention(member.id)} to kood/Jõhvi!`,
	];

	const randomNr = Math.floor(Math.random() * greetings.length);
	const shuffledArray = await shuffleArray(greetings);

	return shuffledArray[randomNr];
}
