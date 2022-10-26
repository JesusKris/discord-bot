const { userMention, AuditLogEvent } = require("discord.js");
const { getWarningEmbed } = require("../bot-responses/embeds/warning.js");
const { handleError } = require("../modules/errorHandling.js");
const { getGuildSettings } = require("../modules/guildSettings.js");

module.exports = async (client, member) => { // eslint-disable-line

	if (member.user.bot) return;

	const settings = await getGuildSettings(member);

	// setup not done || notifications disabled
	if (!settings || !settings.notification_channel) return;

	const channel = await member.guild.channels.cache.get(settings.notification_channel);

	// channel has been deleted
	if (!channel) return;


	// kick
	const fetchedKickLogs = await getKickLogs(member);
	const kickLog = fetchedKickLogs.entries.first();
	if (kickLog && kickLog.target.id == member.user.id && kickLog.createdTimestamp > (Date.now() - 3500)) {
		return await sendNotification(channel, member, "kick", kickLog);
	}


	// ban
	const fetchedBanLogs = await getBanLogs(member);
	const banLog = fetchedBanLogs.entries.first();
	if (banLog && banLog.target.id == member.user.id && banLog.createdTimestamp > (Date.now() - 3500)) {
		return await sendNotification(channel, member, "ban", banLog);
	}

	// leaving
	await sendNotification(channel, member, "left", null);

};


async function getKickLogs(member) {
	const data = await member.guild.fetchAuditLogs({
		limit: 1,
		type: AuditLogEvent.MemberKick,
	});

	return data;
}

async function getBanLogs(member) {
	const data = await member.guild.fetchAuditLogs({
		limit: 1,
		type: AuditLogEvent.MemberBanAdd,
	});

	return data;
}


async function sendNotification(channel, member, type, logs) {

	const reason = {
		name: "Reason",
		value: null,
		inline: false,
	};

	switch (type) {
	case "kick":
		reason.value = `Kicked by ${userMention(logs.executor.id)}`;
		break;
	case "ban":
		reason.value = `Banned by ${userMention(logs.executor.id)}`;
		break;
	case "left":
		reason.value = "Left";
		break;
	}

	try {
		await channel.send(
			{
				embeds: [await getWarningEmbed("User has left the server!", `Username: ${userMention(member.user.id)}`, { url: member.user.displayAvatarURL({ dynamic: true }) }, [reason])],
			},
		);
	}
	catch (error) {
		handleError(error);
	}

}

