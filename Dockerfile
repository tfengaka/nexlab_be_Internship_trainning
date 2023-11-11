FROM node:18-alpine3.17

WORKDIR /app

COPY package*.json .
COPY yarn.lock .
COPY /vendor ./vendor

RUN yarn
COPY . /app

EXPOSE 8000
CMD ["yarn", "dev"]
