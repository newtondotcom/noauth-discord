FROM node:18-alpine

RUN mkdir -p /usr/src/bot

WORKDIR /usr/src/bot

EXPOSE 5000

COPY . .

RUN npm install -g pnpm
RUN pnpm install

RUN --mount=type=secret,id=MASTER_URL \
    --mount=type=secret,id=API_KEY \
    echo "MASTER_URL=$(cat /run/secrets/MASTER_URL)" >> .env && \
    echo "API_KEY=$(cat /run/secrets/API_KEY)" >> .env

COPY wait-for-constants.sh /usr/src/bot/wait-for-constants.sh
RUN chmod +x /usr/src/bot/wait-for-constants.sh

CMD ["./wait-for-constants.sh"]