const { Formatters } = require('discord.js');
const { handleError } = require('../modules/errorHandling');
const config = require('../appconfig.js');

exports.getSetupMessage = async (guild, object, messageNr) => {

	try {
		switch (messageNr) {
			case 1: return `${Formatters.bold(Formatters.italic('Psst.. over here ' + Formatters.userMention(guild.ownerId)))}`;

			case 2: return `${Formatters.bold(Formatters.italic('Come closer... ' + Formatters.userMention(guild.ownerId)))}`;

			case 3: return `${Formatters.bold('Finally...')} took you a while!\n\nAnyways, Hello, I am ${Formatters.bold(config.client.name)}.\n\nI was told that ${Formatters.bold(guild.name)} is in need of a Discord bot and since you seem to be in charge of here, I've contacted you to get things rolling.\n\nFor me to serve ${Formatters.bold(guild.name)}, you as the leader need to prove me that you are worthy. To do that, I need you to complete a few quests. Before you start panicking, the quests are not hard..., just carefully listen to my instructions.\n\nAre you ready to start? ${Formatters.italic('(type ' + Formatters.bold('yes') + ')')}`;

			case 4: return `Good job! You completed the first quest! ${Formatters.italic('(hopefully it didn\'t take you forever)')}`;

			case 5: return `Next up: ${Formatters.bold('Please tag the channel where you would like to receive join notifications AND only the channel, nothing less, nothing more!')}`;

			case 6: return `Good job! ${Formatters.bold('Please tag the channel where you would like to receive leave notifications, and again... NOTHING LESS, NOTHING MORE!')}`;

			case 7: return 'Ugh.. it seems like you are indeed worthy of my services. Well done..';

			case 8: return `Very well.. let me talk more about myself and the stuff I've set up:\n\nAs you can see, I've created a category called ${Formatters.bold('BOT ADMIN PANEL')} and inside it:\n\n${Formatters.channelMention(object.logChannelId)} - This if for the developers to see if something is wrong with me.\n${Formatters.channelMention(object.chatChannelId)} - This is for the bot admins to issue commands to me in a private environment.\n\n${Formatters.bold('NB! DO NOT DELETE THOSE CHANNELS!')}\n`;

			case 9: return `Next up, I've created roles ${Formatters.roleMention(object.botAdminRoleId)} and ${Formatters.roleMention(object.botDevRoleId)}:\n\n${Formatters.roleMention(object.botAdminRoleId)} - Role needed to use admin only commands.\n${Formatters.roleMention(object.botDevRoleId)} - Role needed to use developer only commands. ${Formatters.bold('(NB THIS SHOULD ONLY BE GIVEN TO ROBERT AND NOT ANYONE ELSE AS THIS ROLE HOLDS A LOT OF POWER')}\n\n${Formatters.bold('NB! DO NOT DELETE THOSE ROLES!')}\n\nTo see more about what I can do type: ${Formatters.bold('!help')}\nThat's it for now. Good luck! (Closing this channel in 1 minute!)`;

			default: throw new TypeError('Please check your message number. Message with selected number does not exist!');
		}
	}
	catch (error) {
		handleError(null, error);
	}
};