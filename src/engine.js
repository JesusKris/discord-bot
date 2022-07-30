const logger = require('./modules/logger.js');

// This will check if the node version you are running is the required Node version, if it isn't it will throw the following error to inform you.
if (Number(process.version.slice(1).split('.')[0]) < 17) logger.error('Node 17.x or higher is required. Update Node on your system.');

const config = require('./appconfig.js');
const { Client, Collection, IntentsBitField } = require('discord.js');
const { readdirSync } = require('fs');
const utils = require('./modules/utils.js');


// Utilizing discord client and providing intents -> what it will use/can use
const client = new Client({
	intents: new IntentsBitField(config.client.intents),
	partials: config.client.partials,
});

const commands = new Collection();

client.container = {
	commands,
};

const initApp = async () => {

	const commands = readdirSync('./commands/').filter(file => file.endsWith('.js'));
	for (const file of commands) {
		const props = require(`./commands/${file}`);
		logger.log(`Loading Command: ${props.config.name}`);
		client.container.commands.set(props.config.name, props);
	}

	const eventFiles = readdirSync('./events/').filter(file => file.endsWith('.js'));
	for (const file of eventFiles) {
		const eventName = file.split('.')[0];
		logger.log(`Loading Event: ${eventName}`);
		const event = require(`./events/${file}`);

		// Bind the client to any event, before the existing arguments provided by the discord.js event. This line is awesome by the way. Just sayin'.
		client.on(eventName, event.bind(null, client));
	}

	utils.pingDB();

};

initApp();
client.login(config.client.token);
