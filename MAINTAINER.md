<!-- ctrl + shift + v to preview -->
#### Last update: Saturday, October 23, 2022

# kood/Bot - Maintainers guidelines

## Table of Contents
1.  [Starting Notes](#starting-notes)
    1. [Introduction](#introduction)
    2. [Code of Conduct](#code-of-conduct)
    3. [Words of Encouragement](#words-of-encouragement) 
2. [Development](#development)
    1. [Development Environment](#development-environment)
    2. [Development Tools](#development-tools)
    3. [Development branch](#development-branch)
3. [Version Control](#version-control)
    1. [Main branch](#main-branch)
    2. [Semantic Versioning](#semantic-versioning)
    3. [Dependabot](#dependabot)
4. [Source Code](#source-code)
    1. [engine.js](#enginejs)
    2. [appconfig.js](#appconfigjs)
    3. [bot-responses](#bot-responses)
    4. [commands](#commands)
    5. [events](#events)
    6. [modules](#modules)
    7. [slash-commands](#slash-commands)
5. [Environmental Variables](#environmental-variables)
    1. [Bot](#bot)
    2. [MariaDB](#mariadb)
    3. [Healthchecks](#healthchecks)
    4. [Backups](#backups)
6. [Docker Compose](#docker-compose)
    1. [Info](#info)
7. [Common Commands](#common-commands)
    1. [Docker](#docker)
    2. [Docker Compose](#docker-compose-1)
    3. [Sequelize-CLI](#sequelize-cli)
8. [Common Procedures](#common-procedures)
    1. [Change image version](#change-image-version)
    2. [Restore a database](#restore-a-database)
    3. [Manual backup of a database](#manual-backup-of-a-database)
    4. [Manually entering the database server]()

## Starting notes
* ### Introduction
    - The following guidelines are there to explain important functionalities, practices and procedures in order to guarantee a certain quality in code and administrative tasks.
* ### Code of Conduct
    - Always be transparent in what you are doing and communicate this to the project owners.
    - Always try your best in whatever task you are tackling.
    - Always follow the projects version control practices.
    - Never share the source code to third-party users.
    - Never use the bot to cause harm to others or have a malicious intent to do so.
    - Never share any confidential information about the bot or the servers the bot is being used in.
    - This Code of Conduct must not be changed without permission.
* ### Words of Encouragement
    - Hey! It is JesusKris, the first maintainer of the bot. It is 22 of okt, 2022 as I am writing this. We are 1 week away from releasing the bot to production and let me tell you.. I am very anxious about it. I have tried my absolute best. I just wanted to tell you that never be afraid to fail and always try your best =)!
## Development
* ### Development Environment
    - To setup a development env:
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
* ### Development Tools
    - This project is using [ESLint](https://www.npmjs.com/package/eslint) to keep the code consistent. Make sure to use it via npm scripts:
        ```
        npm run lint
        ```
        ```
        npm run lint-fix
        ```
* ### Development branch
    - Development branch is there to conduct tests and push changes. From that branch code gets deployed to main branch as a major release, patch or hotfix.
## Version control
* ### Main branch
    - Main branch is there contain production ready code that get deployed. Main branch must only contain working code. Pushes to this branch must be through pull requests to make sure nothing breaks production. From this branch source, the docker image is built.
* ### Semantic Versioning
    - Semantic versioning is a practice to keep in order what and how you are changing your project. It consists of X, Y, Z numbers:
        - X being for major release -> increment this if you introduce a change that breaks a package dependency or a complete new functionality
        - Y being for patch -> increment this if you introduce a big enough change or fix to existing functionalities
        - Z being for hotfix -> increment this if you introduce a small fix to existing functionality right after a major release or patch.
        ```
        Example: kood-bot v1.1.3 |1 major relase|1 patch|3 hotfixes|
        ```
        - Incrementing the previous number will reset the one in front.
* ### Dependabot
    - Dependabot is a Github AI that provides notifications about dependency security vulnerabilities and new versions. It will automatically open a pull request to development branch to update. Make sure to double check what has changed yourself and test out the changes in a development env before pushing code to production.
## Source Code
* ### engine.js
    - The entrypoint for the bot. It is responsible for opening a healthcheck port via express server, initializing a new discord.js Client, uploading slash-commands and binding events to our ./event directory.
* ### appconfig.js
    - Contains all the global variables that can be used across the application. Env variables injection point.
* ### bot-responses
    - Contains common bot responses for code reusability
* ### commands
    - Contains all the legacy chat commands
* ### events
    - Contains all the events that Discord API emits. In engine.js we binded all the corresponding events to the javascript files.
* ### modules
    - Contains common reusable functions.
* ### slash-commands
    - Contains modern slash commands.
## Environmental Variables
* ### Bot
    - **BOT_TOKEN** - The main key to access Discord API. This can never be shared with anyone. To generate a new token go to: **https://discord.com/developers/applications**
    - **BOT_PREFIX** - Needed to perform legacy commands. Bot will check for this prefix.
    - **BOT_INTENTS** -  Intents are named groups of pre-defined WebSocket events, which the discord.js client will receive. More information @ **https://discord-api-types.dev/api/discord-api-types-v10/enum/GatewayIntentBits**
    - **BOT_ID** - Needed to upload slash commands to Discord API.
    **https://discord.com/developers/applications**
    - **BOT_TEST_GUILD** - Needed to upload slash commands to a specific guild and not as a global commands. For development only.
* ### MariaDB
    - **MARIADB_DATABASE** - The name of the specific database.
    - **MARIADB_USER** - The name of the user some other functionalities will use to acces the database.
    - **MARIADB_PASSWORD** - The password for the MARIADB_USER.
    - **MARIADB_ROOT_PASSWORD** - The password for the root user.
    - **MARIADB_HOST** - The address where the database server is hosted. Depending on whether you are using compose or not, it can be localhost or host defined in the compose for the database.
    - **MARIADB_SKIP_TEST_DB** - Whether MariaDB client will create a test database on initial boot or not.
    - **DB_DIALECT** - Needed for various functionalties to define the DBMS our project is using.
    - **MARIADB_CHARACTER_SET** - Needed to select whether to support emojis.
    - **MARIADB_COLLATE** - Needed to tell database how to support emojis.
* ### Healthchecks
    - **HEALTHCHECK_PORT** - The port of which an express server will be hosted in for docker compose healthcheck purposes.
    - **AUTOHEAL_CONTAINER_LABEL** This tells [willfarrell/autoheal](https://hub.docker.com/r/willfarrell/autoheal) to restart all containers that have **autoheal=true** label attached to them. Check @docker-compose.yaml.
* ### Backups
    #### The following variables are purely needed for [tiredofit/db-backup](https://hub.docker.com/r/tiredofit/db-backup) container to work.
    - **DB_TYPE** - Represents the database dialect.
    - **DB_HOST** - Represents the database address.
    - **DB_NAME** - Represents the database name.
    - **DB_USER** - Represents the database user used for connection.
    - **DB_PASS** - Represents the database user password.
    - **DB_DUMP_FREQ** - In minutes, how often a backup is created.
    - **DB_CLEANUP_TIME** - In minutes, when is a backup file deemed expired.
    - **COMPRESSION** - The compression type used when a backup is created.
    - **SPLIT_DB** - If using root as username and multiple DBs on system, set to TRUE to create Seperate DB Backups instead of all in one. - Default FALSE
    - **CONTAINER_ENABLE_MONITORING** - To disable some error logs in the container. At this very moment I am not very sure why. More info [@here](https://github.com/tiredofit/docker-db-backup#manual-backups)
## Docker Compose
* ### Info
    - To understand what is happening in compose you can check out [this](https://www.educative.io/blog/docker-compose-tutorial)
## Common Commands
* ### Docker
    - List all the images
        ```
        docker images    
        ```
    - List all the containers
        ```
        docker ps -a    
        ```
    - To open a shell to a container
        ```
        docker exec -it [CONTAINER] /bin/bash
        ```
    - To build an image in the current directory
        ```
        docker build -t [NAME]:[TAG] .
        ```
    - To remove an image
        ```
        docker rmi [IMAGE_ID]
        ```
    - To remove a container
        ```
        docker rm [CONTAINER_ID]
        ```
    - To log into docker hub NB: Generate an acces token [@here](https://hub.docker.com/settings/security)
        ```
        docker login -u [USERNAME]
        ```
    - To push an image to Docker hub
        ```
        docker push [USER]/[REPO_NAME]:[TAG]
* ### Docker Compose
    - To build the compose
        ```
        docker compose build
        ```
    - To run the compose
        ```
        docker compose up
        ```
    - To stop a compose env
        ```
        docker compose stop
        ```
    - To open a shell to a compose env
        ```
        docker compose exec -it [SERVICE] /bin/bash
        ```
    - To stop and remove compose env
        ```
        docker compose down
        ```
* ### Sequelize-CLI
    NB! To run any of these commands, you must be inside a dir where sequelize config.js exists.
    - To generate a new table
        ```
        npx sequelize-cli model:generate --name [NAME] --attributes [ATTRIBUTES]

        Example:
        npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
        ```
    - To generate a new migration
        ```
        npx sequelize-cli migration:generate --name [NAME]
        ```
        Naming database migrations -> create, alter, update, delete
    - To apply all migrations
        ```
        npx sequelize-cli db:migrate
        ```
    - To undo all migrations
        ```
        npx sequelize-cli db:migrate:undo:all
        ```
    - To undo most recent migration
        ```
        npx sequelize-cli db:migrate:undo
        ```
## Common Procedures
* ### Change image version
    - To change an image version without restarting any of the other containers running inside the compose env, first you need to change the image you want to change in the compose file. Then run the following command:
        ```
        docker compose up --detach [COMPOSE SERVICE]
        ```
* ### Restore a database
    - To restore a database, you need to open a shell to the **tiredofit/db-backup** service and run the following command:
        ```
        restore
        ```
        This will trigger a prompt where you can select which file.
* ### Manual backup of a database
    - To backup a database, you need to open a shell to the **tiredofit/db-backup** service and run the following command:
        ```
        backup-now
        ```
* ### Manually entering the database server
    - First open a shell to the database service. Then log into the MySQL server by entering:
        ```
        mysql -u [USER] -p
        ```
        Then to enter an actual database, run:
        ```
        use [DATABASE];
        ```