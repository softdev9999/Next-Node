const api = require("lib/api");

const handler = async function (req, _res, { currentUserId }) {
    // Rest of the API logic
    const { getLiveNow } = require("lib/user");

    let response = {};
    let {
        query: { count, cursor }
    } = req;
    switch (req.method) {
        case "POST": {
            break;
        }
        case "GET": {
            return { data: await getLiveNow(currentUserId, cursor, count), headers: { "cache-control": "max-age=15" } };
        }
        case "DELETE": {
            break;
        }
    }
    return response;
};
export default api(handler);
