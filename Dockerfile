FROM node:18.20-alpine3.18

WORKDIR /app

COPY package*.json .
COPY yarn.lock .

RUN yarn
COPY . /app

CMD ["yarn", "dev"]