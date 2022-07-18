require('dotenv').config({ path: '../.env' });
module.exports = {
	client: {
		// ./engine.js
		name: 'kood/',
		token: process.env.BOT_TOKEN,
		prefix: process.env.PREFIX,
		intents: JSON.parse(process.env.BOT_INTENTS),

		// ./events/ready.js
		activityStatus: {
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
	},

	// ./modules/error-handling.js
	errorLogs: {
		// time ago when error logs are considered expired
		// current date - days * hours * minutes * seconds * milliseconds
		expired: (new Date() - 7 * 24 * 60 * 60 * 1000),
	},

	statusChecks: {
		// ./events/ready.js
		// hours * minutes * seconds * milliseconds
		databaseTimer: 3 * 60 * 60 * 1000,
		webserverTimer: 3 * 60 * 60 * 1000,
	},


};