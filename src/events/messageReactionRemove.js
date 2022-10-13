const db = require("../data/models");
const { handleError } = require("../modules/errorHandling");

module.exports = async (client, reaction, user) => {
	if (user.bot) return;

	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		}
		catch { }
	}

	if (!reaction.message.author.bot) return;

	const reactMessage = await isReactMessage(reaction.message);

	if (!reactMessage) return;


	// perhaps checking if the author of the reaction was the bot?
	// would be more optimized
	const reactRole = await isReactRole(reaction.emoji, reactMessage);

	if (!reactRole) {
		return reaction.users.remove(user);
	}

	await removeRoleFromMember(client, reactRole, reaction, user);

};

async function isReactMessage(message) {
	try {
		const result = await db.sequelize.models.R_Role_Messages.findByPk(message.id, {
			attributes: ["id"],
			include: [{
				model: db.sequelize.models.R_Role_Reactions,
				attributes: ["role", "emoji"],
				separate: true,
			}],
		});

		return result.toJSON();
	}
	catch (error) {
		handleError(error);
	}

}

async function isReactRole(emojiObject, reactMessage) {
	for (const reaction of reactMessage.R_Role_Reactions) {
		if (reaction.emoji == await getRawEmoji(emojiObject)) {
			return reaction;
		}
	}
	return false;

}

async function getRawEmoji(emoji) {
	try {
		if (!emoji.id) {
			return emoji.name;
		}
		else {
			return emoji.id;
		}
	}
	catch (error) {
		handleError(error);
	}
}

async function removeRoleFromMember(client, reactRole, reaction, user) {
	try {

		const guild = await client.guilds.cache.get(reaction.message.guildId);

		const member = guild.members.cache.get(user.id);

		await member.roles.remove(reactRole.role);

	}
	catch (error) {
		handleError(error);
	}
}