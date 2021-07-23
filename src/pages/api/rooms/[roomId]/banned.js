const api = require("lib/api");

const handler = async function (req, res, { currentUserId }) {
    const { getBannedList } = require("lib/room");
    // Rest of the API logic
    let response = {};
    let {
        query: { roomId }
    } = req;
    switch (req.method) {
        case "POST": {
            break;
        }
        case "GET": {
            const banned = await getBannedList(roomId);
            return { data: banned };
        }
        case "PUT": {
            //update room
            break;
        }
        case "DELETE": {
            break;
        }
    }
    return response;
};
export default api(handler);
