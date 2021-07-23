const api = require("lib/api");
const handler = async function (req, _res, { currentUserId }) {
    // Rest of the API logic
    const { getFeaturedUsers } = require("lib/user");

    let {
        query: { count, cursor }
    } = req;
    let response = {};
    switch (req.method) {
        case "POST": {
            break;
        }
        case "GET": {
            let users = await getFeaturedUsers(currentUserId, cursor, count);
            return { data: users, headers: { "Cache-Control": "max-age=600" } };
        }
        case "DELETE": {
            break;
        }
    }
    return response;
};
export default api(handler);
