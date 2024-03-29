<!-- ctrl + shift + v to preview -->
# A Discord bot


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

This bot intended to make life at [kood/Johvi](https://kood.tech/) better for the students and the school staff by adding features that discord is lacking. The bot supports multi servers. 


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
Build the mariadb image 
```
docker run --name mariadb -p 3306:3306 -e MARIADB_USER= -e MARIADB_PASSWORD= -e MARIADB_DATABASE= -e MARIADB_SKIP_TEST_DB= -e MARIADB_CHARACTER_SET= -e MARIADB_COLLATE= -e MARIADB_ROOT_PASSWORD= bitnami/mariadb:[TAG]
```
Rename **.env-example** to **.env** and fill out the fields
```
.env-example -> .env
```
Apply migrations to the database
```bash
cd ./src/data

npx sequelize-cli db:migrate
```
Run the bot
```bash
node ./src/engine.js
```

## Project Status
_archived_


## Acknowledgements
- [AnIdiotsGuide](https://github.com/AnIdiotsGuide/guidebot) - The basics of building a discord bot.
- [Rtxeon](https://github.com/Rtxeon/Command-Handler-V13-With-Custom-Prefix-For-Each-Guild) - Basic command handling structure.


## Contact
Created by [@JesusKris](https://github.com/JesusKris) - feel free to contact me!
