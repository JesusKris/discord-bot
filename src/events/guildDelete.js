const db = require("../data/models/index.js");
const { handleError } = require("../modules/errorHandling.js");
const logger = require("../modules/logger.js");

module.exports = async (client, guild) => { // eslint-disable-line

	// If outage
	if (!guild.available) return;

	await deleteGuildData(guild);

};

async function deleteGuildData(guild) {
	try {

		await db.sequelize.models.Guilds.destroy({
			where: { id: guild.id },
		});

		logger.guild(`${guild.name}, (id:${guild.id}) removed the client.`);
	}
	catch (error) {
		handleError(`Failed to delete guild from database ${error}`);
	}
}
