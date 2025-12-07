FROM node:22.13-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY tsconfig.json nest-cli.json ./

RUN npm ci

EXPOSE 3000

CMD npm run start:dev