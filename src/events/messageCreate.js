const { handleError } = require('../modules/errorHandling.js');
const logger = require('../modules/logger.js');
module.exports = async (client, message) => { // eslint-disable-line

	try {
		await lol()
	}
	catch (error) {
		handleError(client, error)
	}
};