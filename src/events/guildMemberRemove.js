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


	const fetchedKickLogs = await member.guild.fetchAuditLogs({
		limit: 1,
		type: AuditLogEvent.MemberKick,
	});

	const fetchedBanLogs = await member.guild.fetchAuditLogs({
		limit: 1,
		type: AuditLogEvent.MemberBanAdd,
	});


	const kickLog = fetchedKickLogs.entries.first();
	const banLog = fetchedBanLogs.entries.first();


	// kick
	if (kickLog && kickLog.target.id == member.user.id && kickLog.createdTimestamp > (Date.now() - 3500)) {

		try {
			return channel.send(
				{
					embeds: [await getWarningEmbed("User has left the server!", `Username: ${userMention(member.user.id)}`, { url: member.user.displayAvatarURL({ dynamic: true }) }, [{
						name: "Reason",
						value: `Kicked by ${userMention(kickLog.executor.id)}`,
						inline: false,
					}])],
				},
			);
		}
		catch (error) {
			handleError(error);
		}

	}


	// ban
	if (banLog && banLog.target.id == member.user.id && banLog.createdTimestamp > (Date.now() - 3500)) {

		try {
			return channel.send(
				{
					embeds: [await getWarningEmbed("User has left the server!", `Username: ${userMention(member.user.id)}`, { url: member.user.displayAvatarURL({ dynamic: true }) }, [{
						name: "Reason",
						value: `Banned by ${userMention(banLog.executor.id)}`,
						inline: false,
					}])],
				},
			);
		}
		catch (error) {
			handleError(error);
		}

	}


	// leaving
	try {
		channel.send(
			{
				embeds: [await getWarningEmbed("User has left the server!", `Username: ${userMention(member.user.id)}`, { url: member.user.displayAvatarURL({ dynamic: true }) }, [{
					name: "Reason",
					value: "Left",
					inline: false,
				}])],
			},
		);
	}
	catch (error) {
		handleError(error);
	}


};
