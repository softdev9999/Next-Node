const HTTPError = require("lib/HTTPError");

const api = require("lib/api");
const db = require("lib/db");

const handler = async function (req, res, { currentUserId }) {
    const { getRoom, getParticipant, checkRoomCode } = require("lib/room");
    const { getUserByName, userObject } = require("lib/user");
    const { createToken, ACCOUNT_TYPE } = require("lib/auth");
    const { createRTCToken } = require("lib/agora");

    // Rest of the API logic
    let response = {};
    let {
        query: { roomId, p }
    } = req;
    let room = null;
    let possibleUserId = roomId;
    if (isNaN(roomId)) {
        let isRoomCode = checkRoomCode(roomId);
        if (!isRoomCode) {
            let user = await getUserByName(possibleUserId);
            if (user) {
                return { data: userObject(user, false).user };
            }
        }
    }

    room = await getRoom(roomId, true);

    if (!room) {
        throw new HTTPError("No room found", 404);
    }

    if (room.password && currentUserId != room.ownerId) {
        if (!p) {
            throw new HTTPError("password required", 401);
        } else if (p.toUpperCase() != room.password.toUpperCase()) {
            throw new HTTPError("password incorrect", 401);
        }
    }

    switch (req.method) {
        case "GET": {
            //create new participant
            let user = { id: currentUserId };
            if (!currentUserId && room.type == "public") {
                let insertResult = await db.query(`INSERT INTO usersNew (created,updated) VALUES(UNIX_TIMESTAMP(), UNIX_TIMESTAMP())`);
                let id = insertResult.insertId;
                if (id) {
                    user = { id };
                    response.token = createToken(user.id, ACCOUNT_TYPE.ANONYMOUS);
                } else {
                    throw new HTTPError("Could not create anonymous user.");
                }
            }
            if (!user.id) {
                throw new HTTPError("Could not find user to join");
            }

            if (room.type != "public") {
                if (
                    roomId
                        .toUpperCase()
                        .trim()
                        .toUpperCase()
                        .replace(/[^a-zA-Z0-9]/gi, "") !=
                    room.code
                        .trim()
                        .toUpperCase()
                        .replace(/[^a-zA-Z0-9]/gi, "")
                ) {
                    throw new HTTPError("Invalid party code");
                }
            }
            let member = await getParticipant(roomId, user.id);
            let role = room.type == "public" ? "audience" : "host";
            if (member && member.role == "banned") {
                throw new HTTPError("Invalid party code");
            }
            if (member) {
                role = member.role;
            } else {
                member = {
                    userId: user.id,
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
                    ${db.escape(user.id)},
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
                        rtcToken: createRTCToken(user.id, room.id, role)
                    },
                    cookies: {
                        "Auth-Token": response.token
                    }
                };
            } else {
                throw new HTTPError("Could not join party");
            }
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
