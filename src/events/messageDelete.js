const db = require("../data/models");
const { handleError } = require("../modules/errorHandling");
const { isReactMessage } = require("./messageReactionAdd.js")


module.exports = async (client, message) => {


	if (message.author) {
		if (!message.author.bot) return;
	}

	const reactMessage = await isReactMessage(message);

	if (!reactMessage) return;

	await deleteRolesFromUsers(message, reactMessage);

	await deleteReactMessageData(message);

};


async function deleteRolesFromUsers(message, reactMessage) {
	try {

		for await (const reaction of reactMessage.R_Role_Reactions) {
			await deleteRole(message, reaction.role);
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

		//if role deleted
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