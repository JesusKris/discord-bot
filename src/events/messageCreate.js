const config = require("../appconfig.js");
const { handleError } = require("../modules/errorHandling.js");
const { getUserPermissions, hasPermission } = require("../modules/permissions.js");
const { shuffleArray } = require("../modules/utils.js");
const { getGuildSettings } = require("../modules/guildSettings.js");
const { getWarningEmbed } = require("../bot-responses/embeds/warning.js");
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

	const prefix = new RegExp(`^\\${config.client.prefix}`).exec(message.content);
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


	// special case for setup
	if (cmd.config.name == "setup" && guildSettings == null && await hasPermission(userPermissions, cmd)) {
		try {
			return await cmd.run(client, message, args);
		}
		catch (error) {
			handleError(error);
		}
	}
	

	// special case for setup
	if (cmd.config.name == "setup" && guildSettings != null && await hasPermission(userPermissions, cmd)) {
		await message.delete();
		return message.author.send({ embeds: [await getWarningEmbed(null, "You have already completed setup in that server!")] });
	}


	// if setup is required but guild has not done setup
	if (cmd.config.setupRequired && guildSettings == null) {
		const warning = await message.channel.send({ embeds: [await getWarningEmbed(null, "The server owner has not completed setup process yet!")] });

		await sleep(2500);
		await warning.delete();
		await messageObject.delete();
		return;
	}


	// if user has required permission level to run the command
	if (await hasPermission(userPermissions, cmd)) {
		try {
			await cmd.run(client, message, args, userPermissions);
		}
		catch (error) {
			handleError(error);
		}
	}
	else {
		const warning = await message.channel.send({ embeds: [await getWarningEmbed(null, "You don't have permission to use this command!")] });
		await this.sleep(2500);
		await warning.delete();
		await message.delete();
		return;
	}

};

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