const HTTPError = require("lib/HTTPError");
const AWS = require("aws-sdk");
const api = require("lib/api");
const crypt = require("lib/crypt");
const { default: config } = require("../../../config");
const db = require("lib/db");

const handler = async function (req, res, { currentUserId }) {
    // Rest of the API logic
    let response = {};

    const {
        body,
        query: { reset }
    } = req;

    switch (req.method) {
        case "POST": {
            if (!body.email && !body.phone) {
                throw new HTTPError("No email or phone given");
            }

            // get details for this email first
            let result = await db.query(`SELECT id from usersNew where email=${db.escape(body.email.toLowerCase().trim())} LIMIT 1`);

            if (result.length == 0) {
                return { data: { success: true } };
            }

            let resetOb = {
                email: body.email,
                ts: Math.floor(Date.now() / 1000)
            };

            let emailLinkEnc = config.WEB_HOST + "/account/forgot?reset=" + crypt.encrypt(JSON.stringify(resetOb));

            let params = {
                Destination: {
                    ToAddresses: [body.email]
                },
                Message: {
                    Body: {
                        Text: {
                            Charset: "UTF-8",
                            Data: "Reset your password with this link: " + emailLinkEnc
                        }
                    },
                    Subject: {
                        Charset: "UTF-8",
                        Data: "Scener: Reset Password"
                    }
                },
                Source: "Scener <do-not-reply@scener.com>"
            };

            // Create the promise and SES service object
            try {
                let mailOb = new AWS.SES({ region: "us-west-2" });
                let sendPromise = mailOb.sendEmail(params).promise();

                // Handle promise's fulfilled/rejected states
                await sendPromise
                    .then(function (data) {
                        console.log(data);
                        response = { data: { success: true } };
                    })
                    .catch(function (err) {
                        console.log(err);
                        throw new HTTPError("Could not send new password link.");
                    });
            } catch (e) {
                //throw new HTTPError("SES error " + e.message);
            }
            break;
        }
        case "GET": {
            if (!reset) {
                throw new HTTPError("No reset link given");
            }

            try {
                let emailDecText = crypt.decrypt(reset);

                if (!emailDecText) {
                    throw new HTTPError("Invalid reset code");
                }

                let emailDec = JSON.parse(emailDecText);

                let timeDiff = Math.floor(Date.now() / 1000) - emailDec.ts;

                if (timeDiff > 1200) {
                    throw new HTTPError("Reset link expired");
                }

                let result = null;

                if (emailDec.phone) {
                    result = await db.query(
                        `SELECT id, username from usersNew where phone=${db.escape(emailDec.phone.toLowerCase().trim())} LIMIT 1`
                    );
                } else if (emailDec.email) {
                    result = await db.query(
                        `SELECT id, username from usersNew where email=${db.escape(emailDec.email.toLowerCase().trim())} LIMIT 1`
                    );
                }

                if (result.length == 0) {
                    throw new HTTPError("Email or phone not registered");
                }

                let userRes = db.parse(result)[0];

                return { data: userRes };
            } catch (e) {
                throw new HTTPError("Invalid reset code.");
            }
        }
        case "PUT": {
            break;
        }
        case "DELETE": {
            break;
        }
    }
    return response;
};
export default api(handler);
