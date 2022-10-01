const { getGuildSettings } = require("../modules/guildSettings.js");
const { handleError } = require("../modules/errorHandling.js");
const { getStandardEmbed } = require("../bot-responses/embeds/standard.js");
const { userMention } = require("discord.js");

module.exports = async (client, member) => { // eslint-disable-line

	try {
		if (member.user.bot) return;

		const settings = await getGuildSettings(member);

		// setup not done || notifications disabled
		if (settings == null || settings.notification_channel == null) return;

		const channel = await member.guild.channels.cache.get(settings.notification_channel);

		channel.send(

			{
				embeds: [await getStandardEmbed("A member has joined the server!", `Username: ${userMention(member.user.id)}`, { url: member.user.displayAvatarURL({ dynamic: true }) })],
			},
		);
	}
	catch (error) {
		handleError(error);
	}
};
