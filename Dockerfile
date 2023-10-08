FROM node:latest

RUN mkdir -p /usr/src/bot

WORKDIR /usr/src/bot

COPY . .

RUN npm install

CMD ["sh", "-c", "node generateConstants.js && node index.js"]