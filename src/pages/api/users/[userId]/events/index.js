const api = require("lib/api");
const db = require("lib/db");

const handler = async function (req, res_, { currentUserId }) {
    const {
        query: { userId, after, before }
    } = req;
    // Rest of the API logic
    let response = {};

    switch (req.method) {
        case "GET": {
            let timeQuery = [];
            if (after) {
                timeQuery.push(`startTime > ${db.escape(after)}`);
            }
            if (before) {
                timeQuery.push(`startTime < ${db.escape(before)}`);
            }
            //default to all future events up to 3 hours old
            if (!before && !after) {
                timeQuery.push(`startTime > UNIX_TIMESTAMP(NOW() - INTERVAL 3 HOUR)`);
            }
            let events = await db.query(
                `SELECT * from userEvents where userId=${db.escape(userId)} AND ${timeQuery.join(" AND ")} ORDER BY startTime ASC LIMIT 50`
            );
            return { data: db.parse(events), headers: { "Cache-Control": "max-age=15" } };
        }
    }
    return response;
};

export default api(handler);
