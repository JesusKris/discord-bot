const db = require("../data/models");
const { handleError } = require("../modules/errorHandling");
const { getRawEmoji } = require("../modules/utils.js")

module.exports = async (client, reaction, user) => {
	if (user.bot) return;

	if (reaction.partial) {
		await this.fetchPartialReaction(reaction, user)
	}

	if (!reaction.message.author.bot) return;

	const reactMessage = await this.isReactMessage(reaction.message);

	if (!reactMessage) return;

	const reactRole = await this.isReactRole(reaction.emoji, reactMessage);

	if (!reactRole) {
		return reaction.users.remove(user);
	}

	await addRoleToMember(client, reactRole, reaction, user);
};

exports.isReactMessage = async (message) => {
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

exports.isReactRole = async (emojiObject, reactMessage) => {
	for (const reaction of reactMessage.R_Role_Reactions) {
		if (reaction.emoji == await getRawEmoji(emojiObject)) {
			return reaction;
		}
	}
	return false;

}

exports.fetchPartialReaction = async (reaction, user) => {
	try {
		await reaction.fetch();
		await user.fetch()
		await reaction.message.fetch();
		await reaction.message.reactions.fetch()
	}
	catch { }
}


async function addRoleToMember(client, reactRole, reaction, user) {
	try {

		const guild = await client.guilds.cache.get(reaction.message.guildId);

		const member = await guild.members.cache.get(user.id);

		try {
			await member.roles.add(reactRole.role);
		}
		catch { }


	}
	catch (error) {
		handleError(error);
	}
}