const db = require("../data/models");
const { handleError } = require("../modules/errorHandling");
const { getRawEmoji } = require("../modules/utils");

module.exports = async (client, reaction, user) => {

	if (user.bot) return;

	if (reaction.partial) {
		await reaction.fetch();
	}

	if (!reaction.message.author.bot) return;


	const reactMessage = await isReactMessage(reaction.message);

	if (!reactMessage) return;


	const reactRole = await isReactRole(reaction.emoji, reactMessage);

	if (!reactRole) {
		return reaction.users.remove(user);
	}

	await removeRoleFromMember(client, reactRole, reaction, user);
};


async function removeRoleFromMember(client, reactRole, reaction, user) {
	try {

		const guild = await client.guilds.fetch(reaction.message.guildId);

		let member;
		// try to get from cache
		member = await guild.members.cache.get(user.id);

		if (!member) {
			// if not cached
			member = await guild.members.fetch(user.id);
		}

		try {
			await member.roles.remove(reactRole.role);

		}
		catch {} // eslint-disable-line
	}
	catch (error) {
		handleError(error);
	}
}

async function isReactMessage(message) {
	try {
		const result = await db.sequelize.models.R_Role_Messages.findByPk(message.id, {
			attributes: ["id"],
			include: [{
				model: db.sequelize.models.R_Role_Reactions,
				attributes: ["role", "emoji"],
			}],
		});

		if (result) {
			return result.toJSON();
		}
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