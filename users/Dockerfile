FROM node:22.13-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json nest-cli.json ./

RUN pnpm install --frozen-lockfile

EXPOSE 5001

CMD pnpm run start:dev