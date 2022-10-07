const config = require("../appconfig.js");

exports.run = async (client, interaction, permissions) => {

	if (interaction.options.getSubcommand() == "create") {
		console.log("create");
	}


	if (interaction.options.getSubcommand() == "edit") {
		console.log("edit");
	}


	if (interaction.options.getSubcommand() == "delete") {
		console.log("delete");
	}
};

exports.config = {
	enabled: true,
	name: "react-roles",
	setupRequired: true,
	requiredPermission: config.client.commands.permissions.admin,
	guildOnly: true,
	description: "Create a react-roles message. Add a react-role to a message. Delete a react-role from a message",
	args: "<create> <add> <delete>",
	// Needed for legacy commands
	// maxArgs: 0,
};