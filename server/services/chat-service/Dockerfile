FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${CHAT_SERVICE_PORT:-4004}

CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "--poll", "src/index.ts"]
