const env = require('dotenv');
env.config({ path: '../.env' });
const DiscordJS = require('discord.js');
const { sequelize } = require('./orm/models');
const express = require('express');


// Opening a webserver for endpoints.
const app = express();
const server = app.listen(process.env.WS_PORT, function() { // eslint-disable-line
	console.log('WS succesfully started and listening to requests.');
});


// Utilizing discord client and providing intents -> what it will use/can use
const client = new DiscordJS.Client({
	intents: JSON.parse(process.env.BOT_INTENTS),
});

client.on('ready', () => {
	console.log(`Succesfully started the application and logged in as ${client.user.tag}`);
});


// Pinging mariadb connection with sequelize to check if we get back a healthy connection
const pingDB = async (count) => {
	console.log('Testing database connection..');

	try {
		await sequelize.authenticate();
		console.log('Connection to the database has been established succesfully.');
	}
	catch (error) {
		console.error(`Try: ${count} Unable to connect to the database:`, error);
		if (count != 3) {
			pingDB(count + 1);
		}
		else {
			console.log('Failed to establish database connection. Shutting down..');
			client.destroy();
			process.exit();

		}
	}
};


pingDB(1);
client.login(process.env.BOT_TOKEN);