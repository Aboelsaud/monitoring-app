FROM node:16

WORKDIR /app

RUN npm install

RUN npm install -g @nestjs/cli

COPY . .

CMD [ "npm run", "start:prod" ]
