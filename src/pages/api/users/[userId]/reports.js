const HTTPError = require("lib/HTTPError");
const db = require("lib/db");

const api = require("lib/api");
const handler = async function (req, _res, { currentUserId }) {
    // Rest of the API logic
    let response = {};
    const {
        body,
        query: { userId }
    } = req;
    switch (req.method) {
        case "POST": {
            if (!userId || userId == currentUserId) {
                throw new HTTPError("No user specified");
            }
            if (!body || !body.text) {
                throw new HTTPError("No explanation given");
            }
            let recentReports = await db.query(
                `SELECT * from userReports
                where reporterUserId=${db.escape(currentUserId)} AND reportedUserId=${db.escape(userId)} AND created > UNIX_TIMESTAMP() - 60*5`
            );
            if (recentReports.length) {
                throw new HTTPError("A report has already been filed recently");
            }
            let res = await db.query(
                `INSERT INTO userReports (reporterUserId, reportedUserId, explanation, created) VALUES(${db.escape(currentUserId)},${db.escape(
                    userId
                )},${db.escape(body.text)},UNIX_TIMESTAMP())`
            );
            //maybe email or slack us?
            try {
                const { sendMessageToChannel } = require("lib/slack");
                await sendMessageToChannel(
                    `[New User Report]\n\nexplanation:\n${body.text}\n\nreporter: ${currentUserId}\nreported user: ${userId}`,
                    "naughtylist"
                );
            } catch (e) {
                console.log(e);
            }
            if (res.insertId) {
                return { data: { success: true, reportId: res.insertId } };
            } else {
                throw new HTTPError("Could not save report.");
            }
        }
        case "GET": {
            break;
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
