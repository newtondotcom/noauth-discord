FROM node:latest

RUN mkdir -p /usr/src/bot

WORKDIR /usr/src/bot

COPY . .

RUN npm install

RUN ["node", "generateConstants.js"]
CMD ["node", "index.js"]