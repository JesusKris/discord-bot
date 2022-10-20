FROM node:19-alpine3.15

COPY . /kood-bot

WORKDIR /kood-bot

RUN npm install -omit=dev && npm install -g sequelize-cli && chmod +x entrypoint.sh && apk add curl sudo

ENTRYPOINT ["/bin/sh","-c","./entrypoint.sh"]