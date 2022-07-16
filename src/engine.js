const logger = require('./modules/logger.js');
// This will check if the node version you are running is the required Node version, if it isn't it will throw the following error to inform you.
if (Number(process.version.slice(1).split('.')[0]) < 16) logger.error('Node 17.x or higher is required. Update Node on your system.');

const config = require('./appconfig.js');
const { Client, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const utils = require('./modules/utils.js');

// Utilizing discord client and providing intents -> what it will use/can use
const client = new Client({
	intents: config.client.intents,
});

const commands = new Collection();

client.container = {
	commands,
};

const initApp = async () => {

	// TO DO: ADD COMMAND SAVER TO CACHE

	/* 	    readdirSync('./commands/').forEach((dir) => {
				const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));
				for (const file of commands) {
					const props = require(`./commands/${dir}/${file}`);
					console.log(`Loading command: ${props.help}`)
				}
			}) */

	const eventFiles = readdirSync('./events/').filter(file => file.endsWith('.js'));
	for (const file of eventFiles) {
		const eventName = file.split('.')[0];
		logger.log(`Loading Event: ${eventName}`, 'log');
		const event = require(`./events/${file}`);

		// Bind the client to any event, before the existing arguments provided by the discord.js event. This line is awesome by the way. Just sayin'.
		client.on(eventName, event.bind(null, client));
	}

	utils.pingDB();

};

initApp();
client.login(config.client.token);
