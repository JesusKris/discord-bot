const config = require("../appconfig.js");
const { handleError } = require("../modules/errorHandling.js");
const { getUserPermissions, hasPermission } = require("../modules/permissions.js");
const { shuffleArray } = require("../modules/utils.js");
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

		try {
			await message.guild.members.fetch(message.author);
		}
		catch (error) {
			handleError(error)
		}

	}

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


	//if server owner
	if (cmd.config.setupRequired && !guildSettings && interaction.user.id === interaction.member.guild.ownerId) {
		const warning = await message.channel.send({ embeds: [await getWarningEmbed(null, "You have not completed server setup yet.")] });

		await sleep(2500);

		await warning.delete();

		return await message.delete();
	}


	//user
	if (cmd.config.setupRequired && !guildSettings) {
		const warning = await message.channel.send({ embeds: [await getWarningEmbed(null, "The server owner has not completed setup process yet.")] });

		await sleep(2500);

		await warning.delete();

		return await message.delete();
	}


	// if user has required permission level to run the command
	if (await hasPermission(userPermissions, cmd)) {
		return await cmd.run(client, message, args, userPermissions);

	}


	const warning = await message.channel.send({ embeds: [await getWarningEmbed(null, "You don't have permissions to use this command.")] });

	await this.sleep(2500);

	await warning.delete();

	return await message.delete();
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

async function getPingReply() {
	const randomNr = Math.floor(Math.random() * config.client.pingResponses.choices.length);
	const shuffledArray = await shuffleArray(config.client.pingResponses.choices);
	return shuffledArray[randomNr]
}