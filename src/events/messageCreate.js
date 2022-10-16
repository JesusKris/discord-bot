const config = require("../appconfig.js");
const { handleError } = require("../modules/errorHandling.js");
const { getUserPermissions, hasPermission } = require("../modules/permissions.js");
const { shuffleArray, sleep } = require("../modules/utils.js");
const { getGuildSettings } = require("../modules/guildSettings.js");
const { getWarningEmbed } = require("../bot-responses/embeds/warning.js");
module.exports = async (client, message) => { // eslint-disable-line
	const { container } = client;

	if (message.author.bot) return;

	// @bot
	if (message.content.match(new RegExp(`^<@!?${client.user.id}> ?$`))) {
		return message.channel.send(await getPingReply());
	}

	// If the member on a guild is invisible or not cached, fetch them.
	if (message.guild && !message.member) {
		await fetchMember(member)
	}

	const prefix = await getPrefix(message)
	if (!prefix) return;

	const commandAndInitialArgs = await getCommandAndInitialArgs(message.content, prefix);
	const cmd = await container.commands.get(commandAndInitialArgs.command);

	// if cmd does not exist
	if (!cmd) return;

	// guild only
	if (cmd && !message.guild && cmd.config.guildOnly) return;

	// if enabled
	if (!cmd.config.enabled) return;


	const args = await getCorrectArgs(cmd, commandAndInitialArgs.args);
	const guildSettings = await getGuildSettings(message);
	const userPermissions = await getUserPermissions(guildSettings, message);


	// if server owner
	if (cmd.config.setupRequired && !guildSettings && message.user.id === message.member.guild.ownerId) {
		return await sendWarningResponse(message, "You have not completed server setup yet.")
	}


	// user
	if (cmd.config.setupRequired && !guildSettings) {
		return await sendWarningResponse(message, "The server owner has not completed setup process yet.")
	}
	

	// if user has required permission level to run the command
	if (await hasPermission(userPermissions, cmd)) {
		return await cmd.run(client, message, args, userPermissions);
	}
	
	return await sendWarningResponse(message, "You don't have permissions to use this command.")
	
};

async function fetchMember(message) {
	try {
		await message.guild.members.fetch(message.author);
	}
	catch (error) {
		handleError(error);
	}
}

async function getPrefix(message) {
	
	return new RegExp(`^\\${config.client.prefix}`).exec(message.content);
}

async function getCommandAndInitialArgs(content, prefix) {
	// if starts with prefix
	
	const args = content.slice(prefix[0].length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	
	
	return { command, args };
}

async function getCorrectArgs(command, args) {
	const realArgs = [];
	while (args.length) {
		if (realArgs.length === (command.config.maxArgs - 1) && args.length > 1) {
			realArgs.push(args.join(" "));
			args = [];
		}
		else {
			realArgs.push(args.shift());
		}
	}
	return realArgs;
}

async function getPingReply() {
	const randomNr = Math.floor(Math.random() * config.client.pingResponses.choices.length);
	const shuffledArray = await shuffleArray(config.client.pingResponses.choices);
	return shuffledArray[randomNr];
}


async function sendWarningResponse(messageObject, message) {
	try {
		const warning = await messageObject.channel.send({ embeds: [await getWarningEmbed(null, message)] });

		await sleep(2500);

		await warning.delete();

		await messageObject.delete();
		
	}
	catch (error) {
		handleError(error)
	}
}