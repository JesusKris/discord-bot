const logger = require('../modules/logger.js');
module.exports = async (client, warn) => {
	logger.warn(`A warn event was sent by Discord: \n${JSON.stringify(warn)}`);
};
