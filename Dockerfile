FROM node:22.14.0-bullseye-slim

WORKDIR /app

COPY app /app

RUN npm ci

CMD [ "npm", "start" ]