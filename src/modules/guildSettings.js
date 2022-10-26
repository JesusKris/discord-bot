const db = require("../data/models/index.js");
const { handleError } = require("../modules/errorHandling.js");


exports.getGuildSettings = async (reference) => {
	try {
		const settings = await db.sequelize.models.Guilds.findByPk(reference.guild.id, {
			raw: true,
		});

		return settings;
	}
	catch (error) {
		handleError(error);
	}
};