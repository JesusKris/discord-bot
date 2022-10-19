FROM node:18-alpine3.15

COPY . /kood-bot

WORKDIR /kood-bot

RUN npm install -omit=dev

RUN npm install -g sequelize-cli

RUN chmod +x entrypoint.sh

RUN apk add curl sudo

ENTRYPOINT ["/bin/sh","-c","./entrypoint.sh"]