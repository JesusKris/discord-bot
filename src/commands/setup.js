const { handleError } = require("../modules/errorHandling.js");
const { ChannelType, PermissionsBitField } = require("discord.js");
const { getSetupMessage } = require("../bot-responses/messages/setup.js");
const { sleep, checkValidChannel } = require("../modules/utils.js");
const { MessageMentions: { ChannelsPattern } } = require("discord.js");
const db = require("../data/models/index.js");
const config = require("../appconfig.js");

exports.run = async (client, message, args, permissions) => {
	const savedData = {};
	try {

		await message.delete();
		await createBotAdminRoles(message, savedData);
		await createBotAdminChannels(message, savedData);

	}
	catch (error) {
		handleError(error);
	}

	try {

		await initiateSetupConversation(message, savedData);
		await saveGuildData(message, savedData);

	}
	catch (error) {
		handleError(error);
	}

};

exports.config = {
	enabled: true,
	name: "setup",
	setupRequired: false,
	requiredPermission: config.client.commands.permissions.guildOwner,
	guildOnly: true,
	description: "This will set the bot up in the server",
	args: "",
	maxArgs: 0,
};


async function createBotAdminRoles(message, dataObject) {

	try {
		const botAdminRole = await message.guild.roles.create({
			name: "Bot Admin",
			color: [220, 249, 0],
		});

		dataObject.botAdminRoleId = botAdminRole.id;

	}
	catch (error) {
		handleError(error);
	}
}

async function createBotAdminChannels(message, dataObject) {

	try {
		const setupChannel = await message.guild.channels.create({
			name: "setup", type: ChannelType.GuildText, permissionOverwrites: [
				{
					id: message.guild.roles.everyone.id,
					deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
				},
				{
					id: dataObject.botAdminRoleId,
					allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],

				},
			],
		});
		dataObject.setupChannelId = setupChannel.id;
	}
	catch (error) {
		handleError(error);
	}

}

async function initiateSetupConversation(message, dataObject) {

	try {
		const setupChannel = message.guild.channels.cache.get(dataObject.setupChannelId);


		const firstPing = await setupChannel.send(await getSetupMessage(message, dataObject, 1));
		await sleep(3000);
		await firstPing.delete();


		const secondPing = await setupChannel.send(await getSetupMessage(message, dataObject, 2));
		await sleep(1750);
		await secondPing.delete();


		await setupChannel.send(await getSetupMessage(message, dataObject, 3));
		const filter1 = m => m.content === "yes";
		await setupChannel.awaitMessages({
			filter: filter1,
			max: 1,
			time: 60 * 60 * 1000,
		});


		await setupChannel.send(await getSetupMessage(message, dataObject, 4));
		await sleep(1500);


		await setupChannel.send(await getSetupMessage(message, dataObject, 5));
		const filter2 = m => checkValidChannel(message, m.content);
		const notificationChannel = await setupChannel.awaitMessages({
			filter: filter2,
			max: 1,
			time: 60 * 60 * 1000,
		});

		const idFromContent = await notificationChannel.first().content.match(ChannelsPattern);
		dataObject.notificationChannelId = idFromContent[1];


		await setupChannel.send(await getSetupMessage(message, dataObject, 6));
		await sleep(1500);

		await setupChannel.send(await getSetupMessage(message, dataObject, 7));
		await sleep(30000);
		await setupChannel.delete();
	}
	catch (error) {
		handleError(error);
	}

}

async function saveGuildData(message, object) {

	try {
		await db.sequelize.models.Guilds.create({
			id: message.guild.id,
			setup_status: true,
			admin_role: object.botAdminRoleId,
			notificationChannel: object.notificationChannelId,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
	}
	catch (error) {
		handleError(error);
	}
}