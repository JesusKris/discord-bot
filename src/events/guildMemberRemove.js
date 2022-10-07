const { userMention, AuditLogEvent } = require("discord.js");
const { getWarningEmbed } = require("../bot-responses/embeds/warning.js");
const { handleError } = require("../modules/errorHandling.js");
const { getGuildSettings } = require("../modules/guildSettings.js");

module.exports = async (client, member) => { // eslint-disable-line

	try {
		if (member.user.bot) return;

		const settings = await getGuildSettings(member);

		// setup not done || notifications disabled
		if (settings == null || settings.notification_channel == null) return;

		const channel = await member.guild.channels.cache.get(settings.notification_channel);



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


		// kicklog exists && kicked person == incoming member && kicklog is not older than 2 seconds
		if (kickLog && kickLog.target.id == member.user.id && kickLog.createdTimestamp > (Date.now() - 3500)) {
			channel.send(
				{
					embeds: [await getWarningEmbed("A member has left the server!", `Username: ${userMention(member.user.id)}`, { url: member.user.displayAvatarURL({ dynamic: true }) }, [{
						name: "Reason",
						value: `Kicked by ${userMention(kickLog.executor.id)}`,
						inline: false,
					}])],
				},
			);

		}
		// banlog exists && banned person == incoming member && banlog is not older than 2 seconds
		else if (banLog && banLog.target.id == member.user.id && banLog.createdTimestamp > (Date.now() - 3500)) {
			channel.send(
				{
					embeds: [await getWarningEmbed("A member has left the server!", `Username: ${userMention(member.user.id)}`, { url: member.user.displayAvatarURL({ dynamic: true }) }, [{
						name: "Reason",
						value: `Banned by ${userMention(banLog.executor.id)}`,
						inline: false,
					}])],
				},
			);
		}
		// person left
		else {
			channel.send(
				{
					embeds: [await getWarningEmbed("A member has left the server!", `Username: ${userMention(member.user.id)}`, { url: member.user.displayAvatarURL({ dynamic: true }) }, [{
						name: "Reason",
						value: "Left",
						inline: false,
					}])],
				},
			);
		}


	}
	catch (error) {
		handleError(error);
	}

};
