const logger = require('./logger.js');
const uuid = require('uuid');
const db = require('../data/models/index.js');
const { Op } = require('sequelize');
const config = require('../appconfig.js');
const { getErrorEmbed } = require('../bot-responses/embeds/error.js');
// error.name -> to send it to discord log channel

exports.handleError = async (client, error) => {
	const errorId = uuid.v4();
	logger.error(`Unexpected error: ${error.stack} \n    id ${errorId}`);

	try {

		await clearExpiredErrorLogs();
		await db.sequelize.models.Errors.create(
			{
				id: errorId,
				name: error.name,
				trace: error.stack,
				createdAt: new Date(),
			});

	}
	catch (error1) {
		logger.error(`Failed to save error to database: ${error1.stack}`);
	}
};


async function clearExpiredErrorLogs() {
	try {

		await db.sequelize.models.Errors.destroy({
			where: {
				createdAt: {
					[Op.lte]: config.errorLogs.expired,
				},
			},
		});

	}
	catch (error) {
		logger.error(`Failed to clear expired errors from database: ${error.stack}`);
	}
}