const api = require("lib/api");

const handler = async function (req, res_, { currentUserId }) {
    // Rest of the API logic
    const { getActivity } = require("lib/activity");
    let {
        query: { userId }
    } = req;
    let response = {};

    switch (req.method) {
        case "POST": {
            break;
        }
        case "GET": {
            let act = await getActivity(userId, currentUserId);

            return { data: act, headers: { "Cache-Control": "max-age=0" } };
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
