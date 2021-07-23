const HTTPError = require("lib/HTTPError");

const api = require("lib/api");
const db = require("lib/db");

const handler = async function (req, res, { currentUserId }) {
    const { getRoom } = require("lib/room");

    // Rest of the API logic
    let response = {};
    let {
        query: { roomId }
    } = req;
    let room = null;

    room = await getRoom(roomId);

    if (!room) {
        throw new HTTPError("No room found", 404);
    }
    switch (req.method) {
        case "GET": {
            if (room.type != "public") {
                let promos = await db.query(`select * from promoMessages where active=1 order by updated limit 1`);
                if (promos) {
                    promos = db.parse(promos);
                    if (promos.length > 0) {
                        response = { data: promos[0] };
                    }
                }
            }

            break;
        }
        case "POST": {
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
