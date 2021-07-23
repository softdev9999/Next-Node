const api = require("lib/api");
const HTTPError = require("lib/HTTPError");
const db = require("lib/db");

const handler = async function (req, _res, { currentUserId }) {
    // Rest of the API logic

    let response = {};
    const {
        query: { eventId }
    } = req;
    switch (req.method) {
        case "POST": {
            break;
        }
        case "GET": {
            let event = await db.query(`SELECT * from userEvents WHERE id=${db.escape(eventId)} LIMIT 1`);
            return { data: db.parse(event) };
        }
        case "PUT": {
            break;
        }
        case "DELETE": {
            if (!currentUserId) {
                throw new HTTPError("Not authenticated", 401);
            }
            let result = await db.query(`DELETE from userEvents WHERE id=${db.escape(eventId)} AND userId=${db.escape(currentUserId)} LIMIT 1`);
            if (result.affectedRows) {
                return { data: { success: true } };
            } else {
                throw new HTTPError("Could not delete");
            }
        }
    }
    return response;
};
export default api(handler);
