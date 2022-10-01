const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");


module.exports = {

    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Set the bot up for use in the server")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Choose the server type')
                .setRequired(true)
                .addChoices(
                    { name: 'main', value: "main" },
                    { name: 'sprint', value: "sprint" },
                ))
        .addRoleOption(option =>
            option.setName('admin-role')
                .setDescription('Choose the admin role')
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName('student-role')
                .setDescription('Choose the student role')
                .setRequired(false)
        )
        .addRoleOption(option =>
            option.setName('batch-role')
                .setDescription('Choose the batch role')
                .setRequired(false)
        )
        .addRoleOption(option =>
            option.setName('guest-role')
                .setDescription('Choose the guest role')
                .setRequired(false)
        )
        .addChannelOption(option =>
            option.setName('notification-channel')
                .setDescription('Choose the admin notification channel')
                .setRequired(false)
        )
        .addChannelOption(option =>
            option.setName('greetings-channel')
                .setDescription('Choose the greetings notification channel')
                .setRequired(false)
        )
};