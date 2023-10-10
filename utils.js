import constants from './constants.js';

export async function sendWebhook(title,body){
    const webhook = constants.webhook;
    const data = {
        "embeds": [
            {
                "title": title,
                "description": body,
                "color": 16711680
            }
        ]
    };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };
    await fetch(webhook, options);
}