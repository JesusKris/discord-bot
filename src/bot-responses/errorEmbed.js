const { Formatters } = require("discord.js");


exports.getErrorEmbed = async (name, id, devRole) => {
    const errorEmbed = {
        color: 0xff5050,
        title: `${name}`,
        description: `${Formatters.bold('Error code: ')}[${id}] ${Formatters.roleMention(devRole)}`,
        timestamp: new Date(),
    }
    return errorEmbed
};