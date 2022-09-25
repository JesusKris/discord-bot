const db = require("../data/models/index.js");
const { handleError } = require("../modules/errorHandling.js");


exports.getGuildSettings = async (reference) => {
	try {
		const settings = db.sequelize.models.Guilds.findOne({
			where: {
				id: reference.guild.id,
			},
			raw: true,
			required: false,
		});
		if (settings === null) {
			return null;
		}
		return settings;

	}
	catch (error) {
		handleError(error);
	}
};