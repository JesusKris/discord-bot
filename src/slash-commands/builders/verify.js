const { SlashCommandBuilder } = require("discord.js");


module.exports = {

    data: new SlashCommandBuilder()
        .setName("verify")
        .setDescription("Get verified in this server")
        .addSubcommand(subcommand =>
            subcommand
                .setName("guest")
                .setDescription("Get verified as a guest")
                .addStringOption(option =>
                    option.setName('code')
                        .setDescription('Insert the code provided to you by kood/')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('full-name')
                        .setDescription('Insert your full name')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("student")
                .setDescription("Get verified as a student")
                .addStringOption(option =>
                    option.setName('code')
                        .setDescription('Insert the code provided to you by kood/')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('full-name')
                        .setDescription('Insert your full name')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('gitea-name')
                        .setDescription('Insert your Gitea username')
                        .setRequired(true)
                )
        )

};