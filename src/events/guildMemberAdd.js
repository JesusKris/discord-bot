const { getGuildSettings } = require("../modules/guildSettings.js");
const { handleError } = require("../modules/errorHandling.js");
const { getStandardEmbed } = require("../bot-responses/embeds/standard.js");
const { userMention } = require("discord.js");
const { shuffleArray } = require("../modules/utils.js");

module.exports = async (client, member) => { // eslint-disable-line

	if (member.user.bot) return;

	const settings = await getGuildSettings(member);


	// notifications
	if (settings && settings.notification_channel) {

		await sendNotification(settings, member);

	}


	// greetings
	if (settings && settings.greetings_channel && !settings.is_main) {

		await sendSprintGreeting(settings, member);

	}

};

async function sendNotification(settings, member) {
	try {
		const channel = await member.guild.channels.cache.get(settings.notification_channel);

		// channel has been deleted
		if (!channel) return;

		await channel.send({ embeds: [await getStandardEmbed("User has joined the server!", `Username: ${userMention(member.user.id)}`, { url: member.user.displayAvatarURL({ dynamic: true }) })] });
	}
	catch (error) {
		handleError(error);
	}
}

async function sendSprintGreeting(settings, member) {
	try {
		const channel = await member.guild.channels.cache.get(settings.greetings_channel);

		// channel has been deleted
		if (!channel) return;

		await channel.send(await getGreetingMessage(member));
	}
	catch (error) {
		handleError(error);
	}
}

async function getGreetingMessage(member) {
	const greetings = [
		`Happy marathoning at sprint pace 🛤️ ${userMention(member.id)}!`,
		`Hope you got your best running shoes on 👟 ${userMention(member.id)}!`,
		`Ready, set, goooo ${userMention(member.id)} 🏃!`,
		`There's a new Sprinter lined up at the start ${userMention(member.id)} 🏁`,
		`What is your average pace during the sprint going to be like ⌚ ${userMention(member.id)}?`,
	];

	const randomNr = Math.floor(Math.random() * greetings.length);
	const shuffledArray = await shuffleArray(greetings);

	return shuffledArray[randomNr];
}
