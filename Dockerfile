FROM node:18-alpine3.17

WORKDIR /usr/src/nexlab_week1
COPY . .
RUN yarn
CMD ["yarn", "dev"]