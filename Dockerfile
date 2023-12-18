FROM node:latest

RUN mkdir -p /usr/src/bot

WORKDIR /usr/src/bot

COPY . .

RUN yarn

# Add a script to wait for generateConstants.js to finish
COPY wait-for-constants.sh /usr/src/bot/wait-for-constants.sh
RUN chmod +x /usr/src/bot/wait-for-constants.sh

CMD ["./wait-for-constants.sh"]