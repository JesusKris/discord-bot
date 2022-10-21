<!-- ctrl + shift + v to preview -->
# kood/Bot - A Discord bot


## A discord bot made with the intent to improve the overall experience of [kood/Johvi](https://kood.tech/) Discord server for the students and school staff.


## Table of Contents
* [General Information](#general-information)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Setup](#setup)
* [Usage](#usage)
* [Project Status](#project-status)
* [Acknowledgements](#acknowledgements)
* [Contact](#contact)


## General Information

This bot intends to make life at [kood/Johvi](https://kood.tech/) better for the students and the school staff by adding features that discord is lacking. The bot supports multi servers. 

This bot is also a student project that helps students learn about maintaining a project, writing maintanable code and deploying an application.

The bot is currently maintained by [@JesusKris](https://github.com/JesusKris) 


## Technologies Used
- [Node.js](https://nodejs.dev/) - Backend
- [MariaDB](https://mariadb.org/) - DBMS
- [Sequalize](https://www.npmjs.com/package/sequelize) - ORM
- [Docker](https://www.docker.com/) - App deployment
- [Discord.js](https://www.npmjs.com/package/discord.js) - Discord API wrapper.
- [ESLint](https://www.npmjs.com/package/eslint) - Linter
- [dotenv](https://www.npmjs.com/package/dotenv) - Env variables


## Features
- Multi server support with the use of [MariaDB](https://mariadb.org/)
- **Settings** - Changable per server settings
- **Direct message** - Direct message users costum messages
- **Verification** - Verify users and create costum passwords
- **Admin notification** - Notifications about user joining/leaving/kicked/banned
- **Greetings** - Greet your users on joining a server or completing verification
- **Reaction roles** - Create costum react-roles messages that support costum emojis 
- **Slash commands** - All commmands are slash commands for optimal user experience
- **Permissions** - A per command internal permission system 

## Setup
Clone the project
```
git clone git@github.com:JesusKris/kood-bot.git
```
Install dependencies
```
npm install
```
Build the Docker image & change Docker compose to use your made image
```
docker build -t bot:[TAG] .

 bot:
    container_name: bot
    image: bot:[TAG]
    ...
```
Rename **.env-example** to **.env** and fill out the fields
```
.env-example -> .env
```
Run the docker-compose file
```
docker compose up --detach
```

## Project Status
_in progress_


## Acknowledgements
- [AnIdiotsGuide](https://github.com/AnIdiotsGuide/guidebot) - The basics of building a discord bot.
- [Rtxeon](https://github.com/Rtxeon/Command-Handler-V13-With-Custom-Prefix-For-Each-Guild) - Basic command handling structure.


## Contact
Created by [@JesusKris](https://github.com/JesusKris) - feel free to contact me!