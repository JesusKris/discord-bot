const logger = require('../modules/logger.js');

// This event executes when the bot leaves a guild.

module.exports = async (client, guild) => {
	
	logger.guild(`${guild.name}, (id:${guild.id}) added the client.`);


	// TO DO: ADD A SETUP FUNCTION THAT SETS UP CATEGORY WITH CHANNELS AND ROLES -> ASKS FROM OWNER FOR INPUT ETC ETC.
};
