const CHANNELS = {
    errors: "https://hooks.slack.com/services/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",
    feedback: "https://hooks.slack.com/services/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",
    naughtylist: "https://hooks.slack.com/services/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",
    nightswatch: "https://hooks.slack.com/services/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",
    live: "https://hooks.slack.com/services/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"
};
module.exports.sendMessageToChannel = (message, channel) => {
    if (!CHANNELS[channel]) {
        return Promise.reject(false);
    }

    return fetch(CHANNELS[channel], {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify({
            text: message
        })
    }).then((res) => res.text());
};
