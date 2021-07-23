const api = require("lib/api");
const HTTPError = require("lib/HTTPError");
const db = require("lib/db");

const handler = async function (req, _res, { currentUserId }) {
    const { getUser } = require("lib/user");
    const { sendEmail } = require("lib/email");
    const { sendMessageToChannel } = require("lib/slack");
    const { createItemInBoard } = require("lib/monday");
    const config = require("config/index").default;
    // Rest of the API logic
    let response = {};
    const {
        body: { uninstalled, description, category, ...others }
    } = req;
    console.log(req.body);
    switch (req.method) {
        case "POST": {
            let email = null;

            if (currentUserId) {
                let user = await getUser(currentUserId);
                if (user) {
                    if (user.email) {
                        email = user.email;
                    }
                }
                if (uninstalled) {
                    await db.query(`UPDATE usersNew set uninstalled=UNIX_TIMESTAMP() WHERE id=${db.escape(currentUserId)}`);
                }
            }

            let result = await db.query(`INSERT INTO userFeedback 
            (
                userId, 
                email,
                category, 
                description,
                created, 
                emailed, 
                uninstalled
            ) 
            VALUES(
                ${db.escape(currentUserId)},
                ${db.escape(email)}, 
                ${db.escape(category)},
                ${db.escape(description)},
                UNIX_TIMESTAMP(),
                ${email ? "UNIX_TIMESTAMP()" : "NULL"},
                ${uninstalled ? "UNIX_TIMESTAMP()" : "NULL"}
            )`);

            if (email && category != "default") {
                await sendEmail({
                    to: email,
                    from: "daniels@scener.com",
                    subject: "Thanks for using Scener",
                    textBody: `Hi!
                        \n\nI'm Daniel, the creator of Scener. I got your feedback that you had an issue and I'd love to hear more about what went wrong so we can fix it.
                        \n\nCan you give me any details on what you tried to do, what broke or what didn’t work? Screenshots or photos would be great too. Anything helps!
                        \n\nThanks!\n\n/ Daniel`,
                    htmlBody: `Hi!
                        \n\nI'm Daniel, the creator of Scener. I got your feedback that you had an issue and I'd love to hear more about what went wrong so we can fix it.
                        \n\nCan you give me any details on what you tried to do, what broke or what didn’t work? Screenshots or photos would be great too. Anything helps!
                        \n\nThanks!\n\n/ Daniel`
                });
            }
            try {
                await sendMessageToChannel(
                    `[${uninstalled ? "UNINSTALL" : "FEEDBACK"}-${
                        config.ENV
                    }]\n\nCategory: ${category}\n\nDescription: ${description}\n\nID: ${currentUserId}\n\n Extra: \n\n${JSON.stringify(others)}`,
                    "feedback"
                );
                await createItemInBoard({ id: currentUserId, email }, category, description);
            } catch (e) {
                console.log(e);
            }
            if (result && result.insertId) {
                return { data: { success: true } };
            } else {
                throw new HTTPError("Could not save feedback.");
            }
        }
        case "GET": {
            break;
        }
        case "DELETE": {
            break;
        }
    }
    return response;
};
export default api(handler);
