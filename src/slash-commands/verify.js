const { handleError } = require("../modules/errorHandling");
const config = require("../appconfig.js");

exports.run = async (client, interaction, permissions) => {
	try {
		
	}
	catch (error) {
		handleError(error);
	}
};

exports.config = {
	enabled: true,
	name: "shutdown",
	setupRequired: true,
	requiredPermission: config.client.commands.permissions.user,
	guildOnly: true,
	description: "Verify yourself in the server with a code provided by kood/",
	args: "",
	//Needed for legacy commands
	// maxArgs: 0,
};