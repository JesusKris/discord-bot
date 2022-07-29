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

	// using this const varName = thing OR otherThing; is a pretty efficient
	// and clean way to grab one of 2 values!
	if (!cmd) return;


	// Some commands may not be useable in DMs. This check prevents those commands from running
	if (cmd && !message.guild && cmd.config.guildOnly) return;


	//check if enabled
	if (!cmd.config.enabled) return;


	const guildSettings = await getGuildSettings(message)
	

	//special case for setup
	if (cmd.config.name == "setup" && guildSettings.setupStatus == undefined) {
		if (message.author.id == message.guild.ownerId && args.length == 0) {
			try {
				return await cmd.run(client, message, args);
			} catch (error) {
				handleError(client, error)
			}
		}

	}

	// if setup is required but guild has not done setup
	if (cmd.config.setupRequired && guildSettings.setupStatus == undefined) return;


	const userLevel = await getUserLevel(guildSettings, message)
	console.log(userLevel)

	//if user has required permission level to run the command
	if (cmd.config.requiredPermission == userLevel) {
		try {
			await cmd.run(client, message, args);
		} catch (error) {
			handleError(client, error)
		}
	}
}