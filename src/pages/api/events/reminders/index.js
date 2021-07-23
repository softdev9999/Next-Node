const api = require("lib/api");
const HTTPError = require("lib/HTTPError");
const db = require("lib/db");

const handler = async function (req, _res, { currentUserId }) {
    // Rest of the API logic

    let response = {};
    const { body } = req;
    switch (req.method) {
        case "POST": {
            if (!currentUserId) {
                throw new HTTPError("Must be signed in");
            }
            if (!body) {
                throw new HTTPError("Missing body");
            }
            if (!body.hostId) {
                throw new HTTPError("Missing host id");
            }
            if (!body.time) {
                throw new HTTPError("Missing time");
            }
            if (!body.message) {
                throw new HTTPError("Missing message");
            }
            if (!body.code) {
                throw new HTTPError("Missing code");
            }
            if (!body.phone) {
                throw new HTTPError("Missing phone");
            }

            let result = await db.query(`INSERT INTO reminders
            (
                userId,
                phone,
                hostId,
                code,
                message,
                time,
                created
            )
            VALUES(
                ${db.escape(currentUserId)},
                ${db.escape(body.phone)},
                ${db.escape(body.hostId)},
                ${db.escape(body.code)},
                ${db.escape(body.message)},
                ${db.escape(body.time)},
                UNIX_TIMESTAMP()
            ) ON DUPLICATE KEY UPDATE message=${db.escape(body.message)}`);
            if (result.insertId || result.affectedRows > 0) {
                return { data: { success: true } };
            } else {
                throw new HTTPError("Could not save reminder");
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
