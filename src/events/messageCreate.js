const config = require('../appconfig.js');
const { handleError } = require('../modules/errorHandling.js');
const { shuffleArray, getGuildSettings, getUserLevel } = require('../modules/utils.js');
module.exports = async (client, message) => { // eslint-disable-line

	const { container } = client;

	//if bot 
	if (message.author.bot) return;


	//if someone @'s the bot
	const clientPing = new RegExp(`^<@!?${client.user.id}> ?$`);
	if (message.content.match(clientPing)) {
		const randomNr = Math.floor(Math.random() * config.client.pingResponses.choices.length);
		const shuffledArray = await shuffleArray(config.client.pingResponses.choices);
		return message.reply(shuffledArray[randomNr]);
	}


	//if message.content does not start with bot mention or prefix
	const prefix = new RegExp(`^<@!?${client.user.id}> |^\\${config.client.prefix}`).exec(message.content);
	if (!prefix) return;


	// message "!say Is this the real life?"
	// command = say
	// args = ["Is", "this", "the", "real", "life?"]
	const args = message.content.slice(prefix[0].length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();


	// If the member on a guild is invisible or not cached, fetch them.
	if (message.guild && !message.member) await message.guild.members.fetch(message.author);


	const cmd = container.commands.get(command)

	//if cmd does not exist
	if (!cmd) return;


	// Some commands may not be useable in DMs. This check prevents those commands from running
	if (cmd && !message.guild && cmd.config.guildOnly) return;


	//check if enabled
	if (!cmd.config.enabled) return;

	/* console.log("hallo") */
	const guildSettings = await getGuildSettings(message)

	//special case for setup
	if (cmd.config.name == "setup" && guildSettings == null) {
		if (message.author.id == message.guild.ownerId && args.length == 0) {
			try {
				return await cmd.run(client, message, args);
			} catch (error) {
				handleError(client, error)
			}
		}
	} else if(cmd.config.name == "setup" && message.author.id == message.guild.ownerId) {
		message.delete();
		return message.author.send("You have already completed setup in that server!")
	}
	

	// if setup is required but guild has not done setup
	if (cmd.config.setupRequired && guildSettings == null) return;


	const userLevels = await getUserLevel(guildSettings, message)

	//if user has required permission level to run the command
	if (userLevels.includes(cmd.config.requiredPermission)) {
		try {
			await cmd.run(client, message, args);
		} catch (error) {
			handleError(client, error)
		}
	}

}