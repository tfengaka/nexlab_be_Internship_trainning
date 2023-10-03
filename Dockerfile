FROM node:18-alpine3.17

WORKDIR /usr/src/nexlab_be
COPY . .
RUN yarn
CMD ["yarn", "dev"]