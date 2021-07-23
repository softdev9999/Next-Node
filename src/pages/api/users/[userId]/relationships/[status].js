const api = require("lib/api");
const HTTPError = require("lib/HTTPError");
const handler = async function (req, res, { currentUserId }) {
    // Rest of the API logic
    const { getFollowing, getFollowers, getBlocked } = require("lib/user");

    let response = {};
    const {
        query: { userId, status, cursor, count }
    } = req;
    switch (req.method) {
        case "POST": {
            break;
        }
        case "GET": {
            switch (status) {
                case "following": {
                    return { data: await getFollowing(userId, cursor, count) };
                }
                case "followers": {
                    return { data: await getFollowers(userId, cursor, count) };
                }
                case "blocked": {
                    return { data: await getBlocked(userId, cursor, count) };
                }
                default: {
                    throw new HTTPError("No relationship status specified.");
                }
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
