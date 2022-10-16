const { handleError } = require("../modules/errorHandling");
const { isReactMessage, isReactRole, fetchPartialReaction } = require("./messageReactionAdd.js")

module.exports = async (client, reaction, user) => {
	if (user.bot) return;

	if (reaction.partial) {
		await fetchPartialReaction(reaction, user)
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

		const guild = await client.guilds.cache.get(reaction.message.guildId);

		const member = await guild.members.cache.get(user.id);

		try {
			await member.roles.remove(reactRole.role);

		}
		catch { }
	}
	catch (error) {
		handleError(error);
	}
}