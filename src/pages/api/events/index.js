const api = require("lib/api");
const HTTPError = require("lib/HTTPError");
const db = require("lib/db");

const handler = async function (req, res_, { currentUserId }) {
    // Rest of the API logic
    const { userObject } = require("lib/user");
    let response = {};
    const { body } = req;
    switch (req.method) {
        case "POST": {
            //Create new event
            if (!currentUserId) {
                throw new HTTPError("Not authenticated", 401);
            }

            if (!body || !body.title || !body.startTime) {
                throw new HTTPError("Missing information");
            }

            let result = await db.query(
                `INSERT INTO userEvents (userId, title, startTime, url, service, roomId, created, deleted) VALUES(${db.escape(currentUserId)},${db.escape(
                    body.title
                )},${db.escape(body.startTime)},${db.escape(body.url)},${db.escape(body.service)},${db.escape(body.roomId)},UNIX_TIMESTAMP(), NULL)`
            );

            if (result && result.insertId) {
                return {
                    data: {
                        id: result.insertId,
                        userId: currentUserId,
                        title: body.title,
                        startTime: body.startTime,
                        service: body.service,
                        url: body.url,
                        roomId: body.roomId,
                        created: Math.round(Date.now() / 1000)
                    }
                };
            } else {
                throw new HTTPError("Could not save event");
            }
        }
        case "GET": {
            const {
                query: { before, after, service }
            } = req;
            let timeQuery = [];
            if (after) {
                timeQuery.push(`startTime > ${db.escape(after)}`);
            }
            if (before) {
                timeQuery.push(`startTime < ${db.escape(before)}`);
            }
            //default to all future events
            if (!before && !after) {
                timeQuery.push(`startTime > UNIX_TIMESTAMP() AND startTime < UNIX_TIMESTAMP() + 86400*7`);
            }
            if (service) {
                timeQuery.push("service=" + db.escape(service.toLowerCase()));
            }
            let events = await db.query(
                `SELECT userEvents.userId, userEvents.*, usersNew.username, usersNew.displayName, usersNew.profileImageUrl, userStats.popularity from userEvents
                JOIN usersNew ON  usersNew.id=userEvents.userId
                JOIN userStats ON userStats.userId=userEvents.userId where ${timeQuery.join(
                    " AND "
                )} AND usersNew.featured > 0 ORDER BY startTime ASC LIMIT 50`
            );

            let uniqueEvents = {};
            for (let i in events) {
                if (!uniqueEvents[events[i].userId] || uniqueEvents[events[i].userId].startTime > events[i].startTime) {
                    uniqueEvents[events[i].userId] = events[i];
                }
            }

            events = Object.values(uniqueEvents)
                .map((e) => {
                    return {
                        user: userObject(e, false).user,
                        ...e
                    };
                })
                .sort((a, b) => a.startTime - b.startTime);
            return { data: { items: db.parse(events), cursor: events.length }, headers: { "Cache-Control": "max-age=60" } };
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
