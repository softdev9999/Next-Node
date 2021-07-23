const HTTPError = require("lib/HTTPError");

const api = require("lib/api");
const db = require("lib/db");

const handler = async function (req, res, { currentUserId }) {
    // Rest of the API logic
    const { getRoom, getParticipant, getParticipants } = require("lib/room");
    const { createRTCToken } = require("lib/agora");

    let response = {};
    const {
        query: { roomId }
    } = req;
    let room = await getRoom(roomId);
    if (!room) {
        throw new HTTPError("No room found", 404);
    }
    switch (req.method) {
        case "POST": {
            //create new participant
            if (room.type != "public") {
                if (roomId.toUpperCase() != room.code && roomId != room.id) {
                    throw new HTTPError("Invalid party code");
                }
            }
            let member = await getParticipant(roomId, currentUserId);
            let role = room.type == "public" ? "audience" : "host";
            if (member && member.role == "banned") {
                throw new HTTPError("Invalid party code");
            }
            if (member) {
                role = member.role;
            } else {
                member = {
                    userId: currentUserId,
                    roomId: room.id,
                    role,
                    created: Date.now() / 1000,
                    updated: Date.now() / 1000
                };
            }
            let result = await db.query(
                `INSERT INTO roomParticipants (
                    roomId,
                    userId,
                    \`role\`,
                    created
                ) 
                VALUES(
                    ${db.escape(room.id)},
                    ${db.escape(currentUserId)},
                    ${db.escape(role)}, 
                    UNIX_TIMESTAMP()
                ) 
                ON DUPLICATE KEY UPDATE updated=UNIX_TIMESTAMP()`
            );
            if (result.affectedRows > 0) {
                return {
                    data: {
                        ...room,
                        member,
                        rtcToken: createRTCToken(currentUserId, room.id, role)
                    }
                };
            } else {
                throw new HTTPError("Could not join party");
            }
        }
        case "GET": {
            if (room.type != "public") {
                let member = await getParticipant(room.id, currentUserId);
                if (!member) {
                    throw new HTTPError("Not a participant");
                }
            }
            let participants = await getParticipants(room.id);
            return { data: participants };
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
