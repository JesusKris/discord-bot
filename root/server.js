import DiscordJS, { GuildMember } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

const client = new DiscordJS.Client({
    intents: [   
        'GUILD_MESSAGES',
        'GUILDS'

        ]  
})

client.login(process.env.TOKEN)

client.on('ready', () => {
    console.log('Bot online')
})


client.on('messageCreate', message => {
    switch(message.content.toUpperCase()) {
        case '?RESET':
            resetBot(message.channel);
            break;

        // ... other commands
    }
});

// Turn bot off (destroy), then turn it back on
function resetBot(channel) {
    // send channel a message that you're resetting bot [optional]
    channel.send('Resetting...')
    .then(msg => client.destroy())
    .then(() => client.login(process.env.TOKEN));
}

client.on("messageCreate", message => {
    if (message.content.toLowerCase() == "shutdown") { // Note that this is an example and anyone can use this command.
        message.channel.send("Shutting down...").then(() => {
            client.destroy();
        })
    }
})