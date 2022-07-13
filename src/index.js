const env = require('dotenv');
env.config({ path: '../.env' });
const DiscordJS = require('discord.js');
const db = require("./data/models/index.js")
const express = require('express');


// Opening a webserver for endpoints.
const app = express();
const webserver = app.listen(process.env.WEBSERVER_PORT, function () { // eslint-disable-line
    console.log('Webserver succesfully started and listening to requests.');
});


// Utilizing discord client and providing intents -> what it will use/can use
const client = new DiscordJS.Client({
    intents: JSON.parse(process.env.BOT_INTENTS),
});

client.on('ready', () => {
    console.log(`Succesfully started the application and logged in as ${client.user.tag}`);
});
module.exports = {
    client
}

// Pinging mariadb connection with sequelize to check if we get back a healthy connection
const pingDB = async () => {
    console.log('Testing database connection..');

    try {
        await db.sequelize.authenticate();
        console.log('Connection to the database has been established succesfully.');
    }
    catch (error) {
        handleError(1,error)
        console.error('Failed to establish database connection:',error);
    }
};


pingDB();
client.login(process.env.BOT_TOKEN);
