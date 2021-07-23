const api = require("lib/api");
const db = require("lib/db");

const handler = async function (req, res_, { currentUserId }) {
    // Rest of the API logic
    const { getPopularShows } = require("lib/content");

    let response = {};
    const {
        query: { service, count, cursor }
    } = req;
    switch (req.method) {
        case "POST": {
            break;
        }
        case "GET": {
            let popular = await getPopularShows(service, currentUserId, cursor, count);
            return { data: db.parse(popular), headers: { "Cache-Control": "max-age=3600" } };
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
