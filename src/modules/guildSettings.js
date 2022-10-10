const db = require("../data/models/index.js");
const { handleError } = require("../modules/errorHandling.js");


exports.getGuildSettings = async (reference) => {
	try {
		const settings = await db.sequelize.models.Guilds.findOne({
			where: {
				id: reference.guild.id,
			},
			raw: true,
		});

		return settings;

	}
	catch (error) {
		handleError(error);
	}
};