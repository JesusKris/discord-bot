const db = require("../data/models/index.js");
const { handleError } = require("../modules/errorHandling.js");
const logger = require("../modules/logger.js");

module.exports = async (client, guild) => {

	// If outage
	if (!guild.available) return;

	try {
		await db.sequelize.models.Guilds.destroy({
			where: { id: guild.id },
		});
	}
	catch (error) {
		handleError(`Failed to delete guild from database ${error}`);
	}

	logger.guild(`${guild.name}, (id:${guild.id}) removed the client.`);

};
