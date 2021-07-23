const api = require("lib/api");
const db = require("lib/db");

const handler = async function (req, res, { currentUserId }) {
    const { createRTCToken } = require("lib/agora");
    const { getRoom, getParticipants, getParticipant, checkRoomCode } = require("lib/room");
    const { getUser, userObject, getUserByName } = require("lib/user");
    const HTTPError = require("lib/HTTPError");
    // Rest of the API logic
    let response = {};
    let {
        query: { roomId },
        body
    } = req;
    switch (req.method) {
        case "POST": {
            break;
        }
        case "GET": {
            let room = null;
            let possibleUserId = roomId;
            if (isNaN(roomId)) {
                let isRoomCode = checkRoomCode(roomId);
                console.log(!!isRoomCode);
                if (!isRoomCode) {
                    let user = await getUserByName(possibleUserId);
                    if (user) {
                        return { data: userObject(user, false).user };
                    } else {
                        throw new HTTPError("Invalid room id");
                    }
                }
            }
            room = await getRoom(roomId);
            if (!room) {
                throw new HTTPError("Invalid room id");
            }
            let participants = [];
            console.log({ code: room.code, currentUserId });

            let member = await getParticipant(room.id, currentUserId);
            let owner = null;
            if (member && member.role == "banned") {
                throw new HTTPError("Invalid party code");
            }
            if (member) {
                member.rtcToken = createRTCToken(currentUserId, room.id + "", member.role);
            } else if (
                room.type == "private" &&
                roomId &&
                room.code &&
                roomId
                    .trim()
                    .toUpperCase()
                    .replace(/[^a-zA-Z0-9]/gi, "") !=
                    room.code
                        .trim()
                        .toUpperCase()
                        .replace(/[^a-zA-Z0-9]/gi, "")
            ) {
                throw new HTTPError("Invalid room id");
            }
            console.log(room);
            if (room) {
                participants = await getParticipants(room.id);
                owner = await getUser(room.ownerId);
                if (owner) {
                    owner = userObject(owner, currentUserId == owner.id).user;
                } else {
                    console.log("NO OWNER FOUND");
                    throw new HTTPError("Invalid room id");
                }
            }
            if (req.headers && req.headers.referer && req.headers.referer.match(/\/live\//gi) && member && !member.joined) {
                await db.query(
                    `UPDATE roomParticipants set joined=UNIX_TIMESTAMP() WHERE userId=${db.escape(member.userId)} AND roomId=${db.escape(
                        member.roomId
                    )}`
                );
            }
            return {
                data: {
                    ...room,
                    member,
                    participants,
                    owner
                }
            };
        }
        case "PUT": {
            //update room

            let room = await getRoom(roomId);
            if (!room) {
                throw new HTTPError("Invalid room id");
            }
            let member = await getParticipant(room.id, currentUserId);
            if (member.role != "owner" && member.role != "host") {
                throw new HTTPError("Not a owner or co-host");
            }
            let updates = [];
            if (body.memberCount && body.memberCount > room.maxUsers) {
                updates.push(`maxUsers=${db.escape(body.memberCount)}`);
            }
            if (typeof body.pinnedMessage !== "undefined" && member.role == "owner") {
                updates.push(`pinnedMessage=${db.escape(body.pinnedMessage)}`);
            }
            if (typeof body.hostId !== "undefined") {
                updates.push(`hostId=${db.escape(body.hostId)}`);
            }

            if (updates.length > 0) {
                let updateRes = await db.query(`UPDATE rooms set ${updates.join(", ")} WHERE rooms.id=${db.escape(room.id)} LIMIT 1`);
                if (updateRes.affectedRows > 0) {
                    return { data: { success: true } };
                } else {
                    return { data: { success: false } };
                }
            } else {
                return { data: { success: true } };
            }
        }
        case "DELETE": {
            break;
        }
    }
    return response;
};
export default api(handler);
