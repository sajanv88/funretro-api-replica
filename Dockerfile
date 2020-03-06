FROM node:12.13-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npx yarn install --only=production

COPY . .

CMD ["yarn", "start:prod"]