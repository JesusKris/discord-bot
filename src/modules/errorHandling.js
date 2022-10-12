const logger = require("./logger.js");
const uuid = require("uuid");
const db = require("../data/models/index.js");
const { Op } = require("sequelize");
const config = require("../appconfig.js");


exports.handleError = async (error) => {
	const errorId = uuid.v4();
	logger.error(`Unexpected error: ${error.stack} \n    id ${errorId}`);

	await clearExpiredErrorLogs();

	await createNewErrorLog(error, errorId);

};


async function clearExpiredErrorLogs() {
	try {
		await db.sequelize.models.Errors.destroy({
			where: {
				created_at: {
					[Op.lte]: config.errorLogs.expired,
				},
			},
		});

	}
	catch (error) {
		logger.error(`Failed to clear expired errors from database: ${error.stack}`);
	}
}

async function createNewErrorLog(error, errorId) {
	try {
		await db.sequelize.models.Errors.create(
			{
				id: errorId,
				name: error.name,
				trace: error.stack,
				created_at: new Date(),
			});
	}
	catch (error1) {
		logger.error(`Failed to save error to database: ${error1.stack}`);
	}
}