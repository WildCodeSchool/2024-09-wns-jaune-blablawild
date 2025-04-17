FROM node:lts-alpine

ENV CHOKIDAR_USEPOLLING=true

RUN mkdir /app
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY tsconfig*.json ./
COPY src src

CMD ["npm", "run", "dev"]