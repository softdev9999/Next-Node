const HTTPError = require("lib/HTTPError");
const api = require("lib/api");
const db = require("lib/db");

const handler = async function (req, _res, { currentUserId }) {
    // Rest of the API logic

    const { getRoom, getParticipant } = require("lib/room");
    const { getUserByName } = require("lib/user");
    const { createRTCToken } = require("lib/agora");
    let response = {};
    const {
        query: { roomId, userId },
        body
    } = req;
    let room = await getRoom(roomId);

    switch (req.method) {
        case "POST": {
            //create new participant

            break;
        }
        case "GET": {
            let member = await getParticipant(roomId, currentUserId);
            if (!member) {
                throw new HTTPError("Not a participant");
            }
            if (userId == currentUserId) {
                member.rtcToken = createRTCToken(currentUserId, room.id, member.role);
                return { data: member };
            } else if (member) {
                return { data: await getParticipant(room.id, userId) };
            }

            break;
        }
        case "PUT": {
            //update participant role
            if (!body || (!body.role && !body.uid && typeof body.moderator == "undefined")) {
                throw new HTTPError("Nothing to update");
            }
            let member = await getParticipant(roomId, currentUserId);
            if (!member || member.role == "banned" || member.role == "audience") {
                throw new HTTPError("Not a participant");
            }
            let update = null;
            let user = null;
            let otherUserId = userId;
            if (isNaN(userId)) {
                user = await getUserByName(userId);
                if (!user) {
                    throw new HTTPError("User not found");
                }
                otherUserId = user.id;
            }
            if (otherUserId == currentUserId) {
                if (member.role == "host" && body.role == "audience") {
                    //user is leaving co-hosting
                    update = `UPDATE roomParticipants SET role="audience"
                                WHERE userId=${db.escape(otherUserId)} AND roomId=${db.escape(room.id)}`;
                } else if (body.uid) {
                    update = `UPDATE roomParticipants SET agoraUserId=${db.escape(body.uid)}
                                WHERE userId=${db.escape(otherUserId)} AND roomId=${db.escape(room.id)}`;
                }
            } else {
                if (member.role == "owner") {
                    let updateClauses = [];
                    if (body.role) {
                        updateClauses.push(`role=${db.escape(body.role)}`);
                    }
                    if (typeof body.moderator !== "undefined") {
                        updateClauses.push(`moderator=${db.escape(!!body.moderator)}`);
                    }
                    update = `INSERT INTO roomParticipants (userId, roomId, role,moderator, created,updated) VALUES(
                        ${db.escape(otherUserId)},
                    ${db.escape(roomId)},
                    ${db.escape(body.role || "audience")},
                    ${db.escape(!!body.moderator)},
                    UNIX_TIMESTAMP(),
                    UNIX_TIMESTAMP())
                    ON DUPLICATE KEY UPDATE
                    ${updateClauses.join(",")}, updated=UNIX_TIMESTAMP()`;
                } else if (member.moderator) {
                    let otherMember = await getParticipant(roomId, otherUserId);
                    if (otherMember && otherMember.role != "owner" && otherMember.role != "host" && body.role == "banned") {
                        update = `UPDATE roomParticipants set role=${db.escape(body.role)}
                                    WHERE userId=${db.escape(otherUserId)} AND roomId=${db.escape(room.id)}`;
                    }
                }
            }
            console.log(update);
            if (update) {
                let res = await db.query(update);
                if (res.affectedRows > 0) {
                    return { data: { success: true, userId: otherUserId } };
                }
            }
            return { data: { success: false } };
        }
        case "DELETE": {
            break;
        }
    }
    return response;
};
export default api(handler);
