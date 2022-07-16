const logger = require('./logger.js');
const uuid = require('uuid');
const db = require('../data/models/index.js');
/* const Errors = require("../data/models/errors.js") */

// error.stack -> to log it into console + save it to database
// error.name -> to send it to discord log channel
//
exports.handleError = async (type, error) => {
	const errorId = uuid.v4();
	logger.error(`Unexpected error: ${error.stack} \n    id ${errorId}`);

	try {
		await db.sequelize.models.Errors.create({ id: errorId, name: error.name, trace: error.stack, createdAt: new Date() });
		await clearExpiredErrorLogs();
	}
	catch (error1) {
		logger.error(`Failed to save error to database: ${error1.stack}`);
	}

	try {
		// for loop over all guild ids the bot is part, then send that log msg to every specified log channel
		// await sendErrorToDiscord(client, error.name, errorId)
	}
	catch (error2) {
		logger.error(`Failed to send error to discord: ${error2.stack}`);
	}

};


async function clearExpiredErrorLogs() {
	try {
		// delete everything from errors table where log is older than 14days

	}
	catch (error) {
		logger.error(`Failed to clear expired errors from database: ${error.stack}`);
	}
}