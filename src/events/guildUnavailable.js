const logger = require('../modules/logger.js');

module.exports = async (client, warn) => {

	logger.warn(`A guild unavailable event was sent by Discord: \n${JSON.stringify(warn)}`);

};
