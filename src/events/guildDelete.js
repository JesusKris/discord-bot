const db = require('../data/models/index.js');
const { handleError } = require('../modules/errorHandling.js');
const logger = require('../modules/logger.js');

module.exports = async (client, guild) => {
	// If there is an outage, return.
	if (!guild.available) return;

	logger.guild(`${guild.name}, (id:${guild.id}) removed the client.`);

	try {
		await db.sequelize.models.Guilds.destroy({
			where: { id: guild.id },
		});
	}
	catch (error) {
		handleError(error);
	}

};
