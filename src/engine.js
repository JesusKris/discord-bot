import DiscordJS, { GuildMember } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const client = new DiscordJS.Client({
	intents: [
		'GUILD_MESSAGES',
		'GUILDS',

	],
});

client.login(process.env.TOKEN);

client.on('ready', () => {
	console.log('Bot online');
});


/* client.on('messageCreate', message => {
	switch (message.content.toUpperCase()) {
	case '?RESET':
		resetBot(message.channel);
		break;

        ... other commands
	}
});


function resetBot(channel) {
    console.log("bot restarting")
	channel.send('Resetting...')
		.then(msg => client.destroy())
		.then(() => client.login(process.env.TOKEN), console.log("bot restarted"));

}

client.on('messageCreate', message => {
	if (message.content.toLowerCase() == 'shutdown') {
		message.channel.send('Shutting down...').then(() => {
			client.destroy();
		});
	}
}); */