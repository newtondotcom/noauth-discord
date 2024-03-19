FROM oven/bun

RUN mkdir -p /usr/src/bot

WORKDIR /usr/src/bot

EXPOSE 5000

COPY . .

RUN bun install

RUN --mount=type=secret,id=MASTER_URL \
    --mount=type=secret,id=API_KEY \
    echo "MASTER_URL=$(cat /run/secrets/MASTER_URL)" >> .env && \
    echo "API_KEY=$(cat /run/secrets/API_KEY)" >> .env

# Add a script to wait for generateConstants.js to finish
COPY wait-for-constants.sh /usr/src/bot/wait-for-constants.sh
RUN chmod +x /usr/src/bot/wait-for-constants.sh

CMD ["./wait-for-constants.sh"]