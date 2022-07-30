exports.run = async (client, message, args) => {
    console.log('WE DID ssssIT')
};

exports.config = {
    enabled: true,
    name: 'hello',
    setupRequired: false,
    requiredPermission: 'Bot Dev',
    guildOnly: true,
    description: 'This will set the bot up in the server',
};