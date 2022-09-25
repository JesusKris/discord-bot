const { bold, roleMention, italic, userMention } = require("discord.js");
const { handleError } = require("../../modules/errorHandling");
const config = require("../../appconfig.js");

exports.getSetupMessage = async (message, object, messageNr) => {

	try {
		switch (messageNr) {
		case 1: return `${bold(italic("Psst.. over here " + userMention(message.guild.ownerId)))}`;

		case 2: return `${bold(italic("Come closer... " + userMention(message.guild.ownerId)))}`;

		case 3: return `${bold("Finally...")} took you a while!\n\nAnyways, Hello, I am ${bold(config.client.name)}.\n\nI was told that ${bold(message.guild.name)} is in need of a Discord bot and since you seem to be in charge of here, I've contacted you to get things rolling.\n\nFor me to serve ${bold(message.guild.name)}, you as the leader need to prove me that you are worthy. To do that, I need you to complete a few quests. Before you start panicking, the quests are not hard..., just carefully listen to my instructions.\n\nAre you ready to start? ${italic("(type " + bold("yes") + ")")}`;

		case 4: return `Good job! You completed the first quest! ${italic("(hopefully it didn't take you forever)")}`;

		case 5: return `Next up: ${bold("Please tag the channel where you would like to receive join/leave notifications AND only the channel, nothing less, nothing more!")}`;

		case 6: return "Ugh.. it seems like you are indeed worthy of my services. Well done..";

		case 7: return `Next up, I've a created role ${roleMention(object.botAdminRoleId)}:\n\n- Role needed to use admin only commands.\n\nTo see more about what I can do type: ${bold("/help")}\nThat's it for now. Good luck! (Closing this channel in 30 seconds!)`;

		default: throw new TypeError("Please check your message number. Message with selected number does not exist!");
		}
	}
	catch (error) {
		handleError(null, error);
	}
};