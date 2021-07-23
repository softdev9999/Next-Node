const api = require("lib/api");
const HTTPError = require("lib/HTTPError");
const db = require("lib/db");

const handler = async function (req, res, { currentUserId }) {
    // Rest of the API logic
    let response = {};
    const {
        body: { code, resubscribe }
    } = req;
    switch (req.method) {
        case "POST": {
            if (!code) {
                throw new HTTPError("No code provided");
            }
            let rez = await db.query(
                `UPDATE usersNew set unsubscribed=${!resubscribe ? "UNIX_TIMESTAMP()" : "NULL"} WHERE emailHash=${db.escape(code)}`
            );
            if (rez && res.affectedRows) {
                return { data: { success: true } };
            } else {
                throw new HTTPError("Could not unsubscribe.");
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
