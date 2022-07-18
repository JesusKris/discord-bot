const logger = require('../modules/logger.js');

module.exports = async (client, error) => {

	logger.debug(`A debug event was sent by Discord: ${JSON.stringify(error)}`);

};