const config = require("../appconfig.js");

exports.run = async (client, interaction, permissions) => {

	if (interaction.options.getSubcommand() == "create") {
		console.log("create")
	}


	if (interaction.options.getSubcommand() == "edit") {
		console.log("edit")
	}


	if (interaction.options.getSubcommand() == "delete") {
		console.log("delete")
	}
};

exports.config = {
	enabled: true,
	name: "react-roles",
	setupRequired: true,
	requiredPermission: config.client.commands.permissions.admin,
	guildOnly: true,
	description: "All about reaction roles",
	args: ["<role> <message>"],
	maxArgs: 2,
};