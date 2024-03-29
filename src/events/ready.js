const logger = require("../modules/logger.js");
const { ActivityType } = require("discord.js");
const { handleError } = require("../modules/errorHandling.js");

module.exports = async (client) => {

	logger.ready(`Succesfully started the application and logged in as ${client.user.tag}`);

	logger.ready(`Online in ${client.guilds.cache.size} servers`);

	async function setActivityStatus() {
		const activityStatus = {
			choices: [
				"Oh Snap!",
				"BIM!",
				"Googling...",
				"PrintRune <3",
				"You got this!",
				"@kood/Jõhvi",
				"🚀",
				"No pressure!",
				"Coding",
				"Sleeping",
				"Sprinting",
				"Eating",
			],
		};

		const random = Math.floor(Math.random() * activityStatus.choices.length);
		try {
			await client.user.setActivity(`${activityStatus.choices[random]}`, { type: ActivityType.Playing });
		}
		catch (error) {
			handleError(error);
		}
	}

	// activity status
	setInterval(setActivityStatus, 30000);
};