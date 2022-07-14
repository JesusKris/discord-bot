const config = require('./../appconfig.js');
module.exports = async client => {
	console.log('ready');
	function changeActivity() {
		const random = Math.floor(Math.random() * config.botActivity.choices.length);
		client.user.setActivity(`${config.botActivity.choices[random]}`, { type: 'PLAYING' });
	}
	setInterval(changeActivity, config.botActivity.timer);
};