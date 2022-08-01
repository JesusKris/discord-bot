const { getStandardEmbed } = require('../bot-responses/embeds/standard');
const { handleError } = require('../modules/errorHandling');
const config = require('../appconfig.js');
const { Formatters } = require('discord.js');
const { noPermissionReply, sleep, warningReply } = require('../modules/utils.js');

exports.run = async (client, message, args, levels) => {
    try {
        if (args.length != 0) {
            switch (args[0]) {
                case 'admin':
                    if (levels.includes('Bot Admin')) {
                        return await sendHelpEmbed(client, message, 'Bot Admin');
                    }

                    return await noPermissionReply(message);

                case 'developer':

                    if (levels.includes('Bot Developer')) {
                        return await sendHelpEmbed(client, message, 'Bot Developer');
                    }

                    return await noPermissionReply(message);
                default:
                    return warningReply(message, `Wrong arguments provided! Available arguments: ${Formatters.bold(this.config.args)}`)
            }

        }
        sendHelpEmbed(client, message);

    }
    catch (error) {
        handleError(client, error);
    }

};


async function sendHelpEmbed(client, message, type = 'User') {
    const { container } = client;
    const arrayOfCommands = [];
    container.commands.forEach((value, index) => {
        if (value.config.requiredPermission == type) {
            const oneCommand = {};
            oneCommand.name = `${config.client.prefix}${value.config.name} [${value.config.args}]`;
            oneCommand.value = Formatters.codeBlock(value.config.description);
            arrayOfCommands.push(oneCommand);
        }
    });
    message.channel.send({ embeds: [await getStandardEmbed(`${config.client.name} | Help`, `Available commands for ${Formatters.bold(type)}:`, arrayOfCommands)] });
}

exports.config = {
    enabled: true,
    name: 'help',
    setupRequired: true,
    requiredPermission: 'User',
    guildOnly: true,
    description: 'This will give you all the available commands.',
    args: ['admin', 'developer'],
    maxArgs: 1,
};