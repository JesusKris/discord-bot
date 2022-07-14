const logger = require('../modules/logger.js');
module.exports = async (client, warn) => {
	logger.warn(`A guild unavailable event was sent by Discord: \n${JSON.stringify(warn)}`);

	//TO DO : ADD A FUNCTION THAT SAVES THE LOG TO DATABASE AND SENDS IT TO DISCORD LOGS TO EVERY GUILD 
	// SELECTED CHANNEL
};
