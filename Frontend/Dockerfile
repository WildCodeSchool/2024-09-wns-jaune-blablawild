FROM node:lts-alpine
RUN npm install -g pnpm

WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install
COPY index.html ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY public/ public/
COPY src/ src/

CMD ["pnpm", "run", "dev"]