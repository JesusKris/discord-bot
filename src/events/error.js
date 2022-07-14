const logger = require('../modules/logger.js');
module.exports = async (client, error) => {
	logger.error(`An error event was sent by Discord: \n${JSON.stringify(error)}`);

	//TO DO : ADD A FUNCTION THAT SAVES THE LOG TO DATABASE AND SENDS IT TO DISCORD LOGS TO EVERY GUILD 
	// SELECTED CHANNEL
};
