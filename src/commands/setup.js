const { handleError } = require("../modules/errorHandling.js")
const { ChannelType, PermissionsBitField } = require("discord.js")
const { getSetupMessage } = require("../bot-responses/messages/setup.js")
const { sleep, checkValidChannel } = require("../modules/utils.js")
const { MessageMentions: { ChannelsPattern } } = require('discord.js');
const db = require('../data/models/index.js');

exports.run = async (client, message, args) => {
	const savedData = {};
	try {

		await message.delete();
		await createBotAdminRoles(message, savedData);
		await createBotAdminChannels(message, savedData);

	}
	catch (error) {
		handleError(null, error);
	}

	try {

		await initiateSetupConversation(message, savedData);
		await saveGuildData(message, savedData);

	}
	catch (error) {
		handleError(null, error);
	}

};

exports.config = {
	enabled: true,
	name: 'setup',
	setupRequired: false,
	requiredPermission: 'Guild Owner',
	guildOnly: true,
	description: 'This will set the bot up in the server',
};







async function createBotAdminRoles(message, dataObject) {

	try {
		const botAdminRole = await message.guild.roles.create({
			name: 'Bot Admin',
			color: [220, 249, 0],
		});

		dataObject.botAdminRoleId = botAdminRole.id;

		const botDevRole = await message.guild.roles.create({
			name: 'Bot Developer',
			color: [255, 80, 80],
		});

		dataObject.botDevRoleId = botDevRole.id;

	}
	catch (error) {
		handleError(null, error);
	}
}

async function createBotAdminChannels(message, dataObject) {

	try {
		const category = await message.guild.channels.create(
			{
				name: 'bot admin panel',
				type: ChannelType.GuildCategory,
				permissionOverwrites: [
					{
						id: message.guild.roles.everyone.id,
						deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
					},
					{
						id: dataObject.botAdminRoleId,
						allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],

					},
					{
						id: dataObject.botDevRoleId,
						allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
					},
				],
			});
		await category.setPosition(0);

		const setupChannel = await category.children.create({ name: 'setup', type: ChannelType.GuildText });
		dataObject.setupChannelId = setupChannel.id;

		const logChannel = await category.children.create({ name: 'logs', type: ChannelType.GuildText });
		dataObject.logChannelId = logChannel.id;

		const chatChannel = await category.children.create({ name: 'admin-chat', type: ChannelType.GuildText });
		dataObject.chatChannelId = chatChannel.id;
	}
	catch (error) {
		handleError(null, error);
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
		const filter1 = m => m.content === 'yes';
		await setupChannel.awaitMessages({
			filter: filter1,
			max: 1,
			time: 60 * 60 * 1000,
		});


		await setupChannel.send(await getSetupMessage(message, dataObject, 4));
		await sleep(1500);


		await setupChannel.send(await getSetupMessage(message, dataObject, 5));
		const filter2 = m => checkValidChannel(message, m.content);
		const joinNotifChannel = await setupChannel.awaitMessages({
			filter: filter2,
			max: 1,
			time: 60 * 60 * 1000,
		});

		const idFromContent = await joinNotifChannel.first().content.match(ChannelsPattern)
		dataObject.joinNotifChannelId = idFromContent[1];


		await setupChannel.send(await getSetupMessage(message, dataObject, 6));
		const leaveNotifChannel = await setupChannel.awaitMessages({
			filter: filter2,
			max: 1,
			time: 60 * 60 * 1000,
		});
		const idFromContent2 = await leaveNotifChannel.first().content.match(ChannelsPattern)
		dataObject.leaveNotifChannelId = idFromContent2[1];

		await setupChannel.send(await getSetupMessage(message, dataObject, 7));
		await sleep(1500);
		await setupChannel.send(await getSetupMessage(message, dataObject, 8));
		await sleep(9000);


		await setupChannel.send(await getSetupMessage(message, dataObject, 9));
		await sleep(60000);
		await setupChannel.delete();
	}
	catch (error) {
		handleError(null, error);
	}

}

async function saveGuildData(message, object) {

	try {
		await db.sequelize.models.Guilds.create({
			id: message.guild.id,
			setup_status: true,
			admin_role: object.botAdminRoleId,
			dev_role: object.botDevRoleId,
			log_channel: object.logChannelId,
			join_channel: object.joinNotifChannelId,
			leave_channel: object.leaveNotifChannelId,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
	}
	catch (error) {
		handleError(null, error);
	}
}