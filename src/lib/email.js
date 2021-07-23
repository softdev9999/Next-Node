const templates = require("lib/templates");
const { default: config } = require("config/index.js");
const md5 = require("md5");
module.exports.sendEmail = ({ to, from, subject, htmlBody, textBody }) => {
    const aws = require("aws-sdk");
    const ses = new aws.SES({ region: "us-west-2" });
    let params = {
        Destination: {
            ToAddresses: [to]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: htmlBody
                },
                Text: {
                    Charset: "UTF-8",
                    Data: textBody
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: subject
            }
        },
        Source: from
    };
    return ses
        .sendEmail(params)
        .promise()
        .then((d) => d)
        .catch((e) => e);
};

module.exports.sendDownloadLinkEmail = (to) => {
    let b64Email = Buffer.from(to).toString("base64");
    let hashedEmail = md5(to);
    return this.sendEmail({
        to,
        from: "Scener<do-not-reply@scener.com>",
        subject: "Your Scener download link",
        htmlBody: this.populateTemplate("first", {
            LINK: `${config.WEB_HOST}/get?u=${b64Email}&utm_source=email`,
            EMAIL: to,
            UNSUBSCRIBE: `${config.WEB_HOST}/unsubscribe?email=${hashedEmail}`
        }),
        textBody: `${config.WEB_HOST}/get?u=${b64Email}&utm_source=email`
    });
};

module.exports.populateTemplate = (templateKey, data) => {
    let temp = templates[templateKey];
    if (!temp) {
        return null;
    }
    for (let k in data) {
        let reg = new RegExp("\\[" + k.toUpperCase() + "\\]", "g");
        temp = temp.replace(reg, data[k]);
    }
    return temp;
};
