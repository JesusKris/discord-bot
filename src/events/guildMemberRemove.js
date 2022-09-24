const { userMention, AuditLogEvent } = require('discord.js');
const { getWarningEmbed } = require('../bot-responses/embeds/warning.js');
const { handleError } = require('../modules/errorHandling.js');
const logger = require('../modules/logger.js');
const { getGuildSettings } = require('../modules/utils.js');

module.exports = async (client, member) => { // eslint-disable-line

	try {
		if (member.user.bot) return;

		const settings = await getGuildSettings(member)

		if (settings == null) return;

		const channel = await member.guild.channels.cache.get(settings.notificationChannel)


		const fetchedKickLogs = await member.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.MemberKick,
		});

		const fetchedBanLogs = await member.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.MemberBanAdd,
		});

		const kickLog = fetchedKickLogs.entries.first()
		const banLog = fetchedBanLogs.entries.first()

		if (kickLog && kickLog.target.id == member.user.id && kickLog.createdTimestamp > (Date.now() - 2000)) {
			channel.send(
				{
					embeds: [await getWarningEmbed(`A member has left the server!`, `Username: ${userMention(member.user.id)}`, [{
						name: 'Reason',
						value: `Kicked by ${userMention(kickLog.executor.id)}`,
						inline: false,
					}], {}, { url: member.user.displayAvatarURL({ dynamic: true }) })]
				}
			)
		} else if (banLog && banLog.target.id == member.user.id && banLog.createdTimestamp > (Date.now() - 2000)) {
			channel.send(
				{
					embeds: [await getWarningEmbed(`A member has left the server!`, `Username: ${userMention(member.user.id)}`, [{
						name: 'Reason',
						value: `Banned by ${userMention(banLog.executor.id)}`,
						inline: false,
					}], {}, { url: member.user.displayAvatarURL({ dynamic: true }) })]
				}
			)
		} else {
			channel.send(
				{
					embeds: [await getWarningEmbed(`A member has left the server!`, `Username: ${userMention(member.user.id)}`, [{
						name: 'Reason',
						value: 'Left',
						inline: false,
					},], {}, { url: member.user.displayAvatarURL({ dynamic: true }) })]
				}
			)
		}


	}
	catch (error) {
		handleError(error)
	}

};
