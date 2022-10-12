const db = require("../data/models");
const { handleError } = require("../modules/errorHandling");

module.exports = async (client, message) => {


	if (message.author) {
		if (!message.author.bot) return;
	}

	const result = await isReactMessage(message);

	if (!result) return;

	await deleteRolesFromUsers(message);

	await deleteReactMessageData(message);

};


async function isReactMessage(message) {
	try {
		const result = await db.sequelize.models.R_Role_Messages.findByPk(message.id);

		return result;

	}
	catch (error) {
		handleError(error);
	}

}


async function deleteRolesFromUsers(message) {
	try {
		const reactionRoles = await db.sequelize.models.R_Role_Reactions.findAll({
			where: {
				guild_id: message.guildId,
				message_id: message.id,
			},
			raw: true,
		});

		if (reactionRoles.length == 0) return;


		for (let i = 0; i < reactionRoles.length; i++) {
			await deleteRole(message, reactionRoles[i].role);
		}

	}
	catch (error) {
		handleError(error);
	}

}

async function deleteRole(message, roleId) {
	try {

		// Deleting the role from members by first creating an exact copy
		// of the role and then deleting the original role from the server
		// this makes the whole process a lot less harmful towards the
		// discord API

		const role = await message.guild.roles.cache.get(roleId);

		if (!role) return;

		await message.guild.roles.create({
			name: role.name,
			color: role.color,
			hoist: role.hoist,
			position: role.position,
			permissions: role.permissions,
			mentionable: role.mentionable,

		});

		role.delete();

	}
	catch (error) {
		handleError(error);
	}
}


async function deleteReactMessageData(message) {
	try {
		await db.sequelize.models.R_Role_Messages.destroy({
			where: {
				id: message.id,
			},
		});
	}
	catch (error) {
		handleError(error);
	}
}