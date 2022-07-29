exports.run = async (client, message, args) => {
console.log('WE DID IT')
};

exports.config = {
	enabled: true,
	name: 'setup',
	setupRequired: false,
	requiredPermission: 'Guild Owner',
	guildOnly: true,
	description: 'This will set the bot up in the server',
};


/* 	const savedData = {};
 */


/* try {

	await createBotAdminRoles(guild, savedData);
	await createBotAdminChannels(guild, savedData);

}
catch (error) {
	handleError(null, error);
}

try {

	await initiateSetupConversation(guild, savedData);
	await saveGuildData(guild, savedData);

}
catch (error) {
	handleError(null, error);
} */


/* async function createBotAdminRoles(guild, object) {

try {
	const botAdminRole = await guild.roles.create({
		name: 'Bot Admin',
		color: [220, 249, 0],
	});

	object.botAdminRoleId = botAdminRole.id;

	const botDevRole = await guild.roles.create({
		name: 'Bot Developer',
		color: [255, 80, 80],
	});

	object.botDevRoleId = botDevRole.id;

}
catch (error) {
	handleError(null, error);
}
}

async function createBotAdminChannels(guild, object) {

try {
	const category = await guild.channels.create('bot admin panel', {
		type: 'GUILD_CATEGORY',
		permissionOverwrites: [
			{
				id: guild.roles.everyone.id,
				deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
			},
			{
				id: object.botAdminRoleId,
				allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],

			},
			{
				id: object.botDevRoleId,
				allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
			},
		],
	});
	await category.setPosition(0);

	const setupChannel = await category.createChannel('setup', { type: 'GUILD_TEXT' });
	object.setupChannelId = setupChannel.id;

	const logChannel = await category.createChannel('logs', { type: 'GUILD_TEXT' });
	object.logChannelId = logChannel.id;

	const chatChannel = await category.createChannel('chat', { type: 'GUILD_TEXT' });
	object.chatChannelId = chatChannel.id;
}
catch (error) {
	handleError(null, error);
}

}

async function initiateSetupConversation(guild, object) {

try {
	const setupChannel = guild.channels.cache.get(object.setupChannelId);


	const firstPing = await setupChannel.send(await getSetupMessage(guild, object, 1));
	await sleep(3000);
	await firstPing.delete();


	const secondPing = await setupChannel.send(await getSetupMessage(guild, object, 2));
	await sleep(1750);
	await secondPing.delete();


	await setupChannel.send(await getSetupMessage(guild, object, 3));
	const filter1 = m => m.content === 'yes';
	await setupChannel.awaitMessages({
		filter: filter1,
		max: 1,
		time: 60 * 60 * 1000,
	});


	await setupChannel.send(await getSetupMessage(guild, object, 4));
	await sleep(1500);


	await setupChannel.send(await getSetupMessage(guild, object, 5));
	const filter2 = m => checkValidChannel(guild, m.content);
	const joinNotifChannel = await setupChannel.awaitMessages({
		filter: filter2,
		max: 1,
		time: 60 * 60 * 1000,
	});

	const idFromContent = await joinNotifChannel.first().content.matchAll(CHANNELS_PATTERN).next().value;
	object.joinNotifChannelId = idFromContent[1];


	await setupChannel.send(await getSetupMessage(guild, object, 6));
	const leaveNotifChannel = await setupChannel.awaitMessages({
		filter: filter2,
		max: 1,
		time: 60 * 60 * 1000,
	});
	const idFromContent2 = await leaveNotifChannel.first().content.matchAll(CHANNELS_PATTERN).next().value;
	object.leaveNotifChannelId = idFromContent2[1];

	await setupChannel.send(await getSetupMessage(guild, object, 7));
	await sleep(1500);
	await setupChannel.send(await getSetupMessage(guild, object, 8));
	await sleep(9000);


	await setupChannel.send(await getSetupMessage(guild, object, 9));
	await sleep(60000);
	await setupChannel.delete();
}
catch (error) {
	handleError(null, error);
}

}

async function saveGuildData(guild, object) {

try {
	await db.sequelize.models.Guilds.create({
		id: guild.id,
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
} */