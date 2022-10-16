const { handleError } = require("./errorHandling");
const { MessageMentions: { ChannelsPattern, RolesPattern, UsersPattern, EveryonePattern } } = require("discord.js");

exports.verifyEmoji = async (reference, emoji) => {
	try {
		const unicodeEmojiOrId = /([0-9]+|\u00a9+|\u00ae+|[\u2000-\u3300]+|\ud83c[\ud000-\udfff]+|\ud83d[\ud000-\udfff]+|\ud83e[\ud000-\udfff]+)/g;

		// if contains ID to costum emoji or unicode emoji
		if (!emoji.match(unicodeEmojiOrId)) {
			return { isVerifiedEmoji: false, emoji: null };
		}

		const firstMatch = emoji.match(unicodeEmojiOrId)[0];

		// if costum, check availability
		if (firstMatch.match(/[0-9]+/g)) {
			if (!await reference.guild.emojis.resolve(firstMatch)) {
				return { isVerifiedEmoji: false, emoji: null };
			}
		}

		return { isVerifiedEmoji: true, emoji: firstMatch };

	}
	catch (error) {
		handleError(error);
	}
};

exports.verifyMessageLink = async (reference, message_link) => {

	// example link
	// https://discordapp.com/channels/1023167499365366746/1026826999911626185/1028283654394368000

	const matchedIds = message_link.match(/[0-9]+/g);

	// if no matches
	if (!matchedIds) {
		return { isVerifiedMessage: false, message: null };
	}

	// !3 ids -> guild|channel|message
	if (matchedIds.length < 3) {
		return { isVerifiedMessage: false, message: null };
	}


	const channelId = matchedIds[1];
	const messageId = matchedIds[2];


	let channel;
	let message;
	try {

		// trying to fetch with id, catching if not valid
		channel = await reference.guild.channels.fetch(channelId);
		message = await channel.messages.fetch(messageId);

	}
	catch { }

	if (!channel) {
		return { isVerifiedMessage: false, message: null };
	}

	if (!message) {
		return { isVerifiedMessage: false, message: null };
	}

	return { isVerifiedMessage: true, message };

};

exports.verifyChannel = async (reference, channel) => {

	if (channel.type != 0) {
		return false;
	}

	let result;
	try {
		result = await reference.guild.channels.fetch(channel.id);
	}
	catch { }

	return result;

};


exports.isEveryoneRole = async (value) => {
	if (value.match(EveryonePattern)) {
		return true;
	}

	return false;
}

exports.isUserMention = async (value) => {
	if (value.match(UsersPattern)) {
		return true
	}

	return false
}


exports.isRoleMention = async (value) => {
	if (value.match(RolesPattern)) {
		return true;
	}

	return false
}

exports.isChannelMention = async (value) => {
	if (value.match(ChannelsPattern)) {
		return true
	}

	return false
}