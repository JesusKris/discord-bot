const config = require('./../appconfig.js');
const logger = require('../modules/logger.js');
module.exports = async client => {
	logger.ready(`Succesfully started the application and logged in as ${client.user.tag}`);
	logger.ready(`Online in ${client.guilds.cache.size} servers`);
	function setActivityStatus() {
		const random = Math.floor(Math.random() * config.client.activityStatus.choices.length);
		client.user.setActivity(`${config.client.activityStatus.choices[random]}`, { type: 'PLAYING' });
	}
	setInterval(setActivityStatus, config.client.activityStatus.timer);


	// TO DO ADD A DATABASE PINGER + WEB SERVER PINGER, EVERY X AMOUNT OF TIME SETINTERVAL
};