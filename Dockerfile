FROM node:18-alpine3.17

WORKDIR /app
COPY package*.json ./

RUN yarn
COPY . /app
EXPOSE 8000
CMD ["yarn", "dev"]
