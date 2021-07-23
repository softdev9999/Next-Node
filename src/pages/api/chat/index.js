const api = require("lib/api");
const { createRTMToken } = require("lib/agora");
const handler = function (req, res, { currentUserId }) {
    // Rest of the API logic
    let response = {};

    switch (req.method) {
        case "POST": {
            break;
        }
        case "GET": {
            if (currentUserId) {
                return { data: { rtmToken: createRTMToken(currentUserId) } };
            }
            break;
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
