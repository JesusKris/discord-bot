const { SlashCommandBuilder } = require('discord.js');


module.exports = {

    data: new SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('Shuts the bot down')

};