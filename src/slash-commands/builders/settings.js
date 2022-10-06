const { SlashCommandBuilder } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("settings")
        .setDescription("See the server settings")
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("See the server settings")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("change")
                .setDescription("Change a server setting")
                .addStringOption(option =>
                    option
                        .setName("setting")
                        .setDescription("Select the server setting you wish to change")
                        .setRequired(true),
                )
                .addStringOption(option =>
                    option
                        .setName("value")
                        .setDescription("Set the new value for the setting specified")
                        .setRequired(true),
                )
        )
}