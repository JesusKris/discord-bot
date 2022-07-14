require('dotenv').config({ path: '../.env' });
module.exports = {
	// ./index.js
	discordClient: {
		token: process.env.BOT_TOKEN,
		prefix: process.env.PREFIX,
		intents: JSON.parse(process.env.BOT_INTENTS),
	},

	// ./events/ready.js
	botActivity: {
		choices: [
			`${process.env.PREFIX}help`,
			'Oh Snap!',
			'BIM!',
			'Googling...',
			'I miss PrintRune...',
			'You got this!',
			'Talk to each other!',
			'kood/Jõhvi',
			'Sillamäe'],
		timer: 15000,
	},
};