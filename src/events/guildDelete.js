const logger = require('../modules/logger.js');

// This event executes when the bot leaves a guild.

module.exports = async (client, guild) => {
	// If there is an outage, return.
	if (!guild.available) return;

	logger.guild(`${guild.name}, (id:${guild.id}) removed the client.`);


	// TO DO: ADD A FUNCTION THAT DELETES ALL DATA ASSOCIATED WITH THAT GUILD WHEN LEAVING
};
