const config = require("../appconfig.js");


exports.run = async (client, interaction, permissions) => { // eslint-disable-line

    console.log("here")
};

exports.config = {
    enabled: true,
    name: "polls",
    setupRequired: true,
    requiredPermission: config.client.commands.permissions.admin,
    guildOnly: true,
    description: "Create a polls message. Add a poll option to a message. Delete a poll option from a message. Deem a poll finished and display final results.Sync and validate all polls messages.",
    args: "<create> <add> <delete> <finish> <sync>",
    // Needed for legacy commands
    // maxArgs: 0,
};