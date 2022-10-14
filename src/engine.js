const logger = require("./modules/logger.js");

// check required Node version
if (Number(process.version.slice(1).split(".")[0]) < 17) logger.error("Node 17.x or higher is required. Update Node on your system.");

const config = require("./appconfig.js");
const { Client, Collection, IntentsBitField, Routes, Partials } = require("discord.js");
const { readdirSync } = require("fs");
const { REST } = require("@discordjs/rest");
const { pingDB } = require("./modules/database.js");


exports.initApp = async () => {

	// Utilizing discord client and providing intents -> what it will use/can use
	const client = new Client({
		shards: 'auto',
		intents: new IntentsBitField(["Guilds", "GuildMembers", "GuildBans", "GuildMessages", "GuildMessageReactions", "MessageContent", "GuildEmojisAndStickers"]),
		partials: [Partials.User, Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction],
	});

	const commands = new Collection();
	const slashCommands = new Collection();

	client.container = {
		commands,
		slashCommands,
	};

	// slash command schema builders
	const slashBuilders = [];
	const fsFiles = readdirSync("./slash-commands/builders").filter(file => file.endsWith(".js"));
	for (const file of fsFiles) {
		const command = require(`./slash-commands/builders/${file}`);
		slashBuilders.push(command.data.toJSON());
	}

	// slash commands
	const slashCommandsDir = readdirSync("./slash-commands").filter(file => file.endsWith(".js"));
	for (const file of slashCommandsDir) {
		const props = require(`./slash-commands/${file}`);
		logger.log(`Loading Slash Command: ${props.config.name}`);
		client.container.slashCommands.set(props.config.name, props);
	}

	// chat legacy commands
	const commandsDir = readdirSync("./commands/").filter(file => file.endsWith(".js"));
	for (const file of commandsDir) {
		const props = require(`./commands/${file}`);
		logger.log(`Loading Command: ${props.config.name}`);
		client.container.commands.set(props.config.name, props);
	}

	// events
	const eventFiles = readdirSync("./events/").filter(file => file.endsWith(".js"));
	for (const file of eventFiles) {
		const eventName = file.split(".")[0];
		logger.log(`Loading Event: ${eventName}`);
		const event = require(`./events/${file}`);

		// Bind the client to any event, before the existing arguments provided by the discord.js event. This line is awesome by the way. Just sayin'.
		client.on(eventName, event.bind(null, client));
	}


	// uploading slash commands schema builders
	const rest = new REST({ version: "10" }).setToken(config.client.token);
	try {
		logger.ready("Started refreshing application (/) commands.");

		// For development, enable test guild commands
		await rest.put(
			Routes.applicationGuildCommands(config.client.Id, config.client.test_guild),
			{ body: slashBuilders },
		);

		/* 		await rest.put(
					Routes.applicationGuildCommands(config.client.Id, config.client.test_guild),
					{ body: [] },
				); */

		// For production, enable global commands
			/* await rest.put(
			Routes.applicationCommands(config.client.Id),
			{ body: [slashBuilders]},
		) */;

		logger.ready("Successfully reloaded application (/) commands.");
	}
	catch (error) {
		console.error(error);
	}

	client.login(config.client.token);
	await pingDB();

};

this.initApp();
