const api = require("lib/api");
const { ACCOUNT_TYPE } = require("lib/auth");
const HTTPError = require("lib/HTTPError");
const db = require("lib/db");

const handler = async function (req, _res, { currentUserId, currentAccountType }) {
    const { getRelationship, getRelationships } = require("lib/user");

    // Rest of the API logic
    let response = {};
    const {
        query: { userId, cursor, count },
        body
    } = req;
    switch (req.method) {
        case "POST": {
            break;
        }
        case "GET": {
            return { data: await getRelationships(userId, cursor, count), headers: { "Cache-Control": "max-age=0" } };
        }
        case "PUT": {
            if (userId == currentUserId) {
                throw new HTTPError("Can't follow yourself");
            }
            if (currentAccountType < ACCOUNT_TYPE.AUTHED) {
                throw new HTTPError("Not authenticated", 401);
            }
            if (!body.status) {
                throw new HTTPError("No relationship status specified.");
            }
            let { from } = await getRelationship(currentUserId, userId);
            let canUpdate = true;
            if (canUpdate) {
                let result = await db.query(
                    `INSERT INTO relationships (
                        fromUserId,
                        toUserId,
                        status,
                        created,
                        updated
                    )
                    VALUES (
                        ${db.escape(currentUserId)},
                        ${db.escape(userId)},
                        ${db.escape(body.status)},
                        UNIX_TIMESTAMP(),
                        UNIX_TIMESTAMP()
                    ) ON DUPLICATE KEY UPDATE status=${db.escape(body.status)}`
                );
                if (result.affectedRows > 0) {
                    return { data: { success: true, relationship: body.status } };
                } else {
                    return { data: { success: false, relationship: from && from.status } };
                }
            } else {
                throw new HTTPError("No authorized.", 401);
            }
        }
        case "DELETE": {
            break;
        }
    }
    return response;
};
export default api(handler);
