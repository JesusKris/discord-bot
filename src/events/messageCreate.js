const config = require('../appconfig.js');
const { getStandardEmbed } = require('../bot-responses/embeds/standard.js');
const { getWarningEmbed } = require('../bot-responses/embeds/warning.js');
const { handleError } = require('../modules/errorHandling.js');
const { shuffleArray, getGuildSettings, getUserLevels, sleep, noPermissionReply, warningReply } = require('../modules/utils.js');
module.exports = async (client, message) => { // eslint-disable-line
	const { container } = client;

	// if bot
	if (message.author.bot) return;


	// if someone @'s the bot
	const clientPing = new RegExp(`^<@!?${client.user.id}> ?$`);
	if (message.content.match(clientPing)) {
		const randomNr = Math.floor(Math.random() * config.client.pingResponses.choices.length);
		const shuffledArray = await shuffleArray(config.client.pingResponses.choices);
		return message.channel.send(shuffledArray[randomNr]);
	}

	// If the member on a guild is invisible or not cached, fetch them.
	if (message.guild && !message.member) await message.guild.members.fetch(message.author);


	const commandAndInitialArgs = await getCommandAndInitialArgs(message.content);


	const cmd = await container.commands.get(commandAndInitialArgs.command);


	// if cmd does not exist
	if (!cmd) return;


	// Some commands may not be useable in DMs. This check prevents those commands from running
	if (cmd && !message.guild && cmd.config.guildOnly) return;


	// check if enabled
	if (!cmd.config.enabled) return;

	const args = await getCorrectArgs(cmd, commandAndInitialArgs.args);
	const guildSettings = await getGuildSettings(message);
	const userLevels = await getUserLevels(guildSettings, message);


	// special case for setup
	if (cmd.config.name == 'setup' && guildSettings == null) {
		if (userLevels.includes(cmd.config.requiredPermission)) {
			try {
				return await cmd.run(client, message, args);
			}
			catch (error) {
				handleError(client, error);
			}
		}
	}
	else if (cmd.config.name == 'setup' && userLevels.includes(cmd.config.requiredPermission)) {
		await message.delete();
		return message.author.send({ embeds: [await getWarningEmbed(null, 'You have already completed setup in that server!')] });
	}


	// if setup is required but guild has not done setup
	if (cmd.config.setupRequired && guildSettings == null) {
		return warningReply(message, 'The server owner has not completed setup process yet!')
	}


	// if user has required permission level to run the command
	if (userLevels.includes(cmd.config.requiredPermission)) {
		try {
			await cmd.run(client, message, args, userLevels);
		}
		catch (error) {
			handleError(client, error);
		}
	}
	else {
		return await noPermissionReply(message);
	}

};

async function getCommandAndInitialArgs(content) {
	// if starts with prefix
	const prefix = new RegExp(`^\\${config.client.prefix}`).exec(content);
	if (!prefix) return;

	const args = content.slice(prefix[0].length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	return { command, args };
}

async function getCorrectArgs(command, args) {
	const realArgs = [];
	while (args.length) {
		if (realArgs.length === (command.config.maxArgs - 1) && args.length > 1) {
			realArgs.push(args.join(' '));
			args = [];
		}
		else {
			realArgs.push(args.shift());
		}
	}
	return realArgs;
}