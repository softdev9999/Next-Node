const api = require("lib/api");
const { ACCOUNT_TYPE } = require("lib/auth");
const HTTPError = require("lib/HTTPError");
const db = require("lib/db");

const handler = api(async function (req, _res, { currentUserId, currentAccountType }) {
    // Rest of the API logic
    const { createRoomCode, getParticipant, getRoom } = require("lib/room");
    const { createRTCToken } = require("lib/agora");
    const { getUser } = require("lib/user");
    const { body } = req;

    let response = {};

    switch (req.method) {
        case "POST": {
            //create new room
            if (!currentUserId || !currentAccountType || currentAccountType < ACCOUNT_TYPE.AUTHED) {
                throw new HTTPError("Not authenticated");
            }
            let room = null;
            let { roomType, roomMode, unlisted, roomId, password } = body;

            if (roomId) {
                let prevRoom = await getRoom(roomId, true);
                let prevMember = await getParticipant(roomId, currentUserId);
                if (!prevRoom || !prevMember) {
                    throw new HTTPError("Cannot clone room");
                }

                //clone the previous room
                let result = await db.query(`INSERT INTO rooms
                                                (
                                                    ownerId,
                                                    type,
                                                    mode,
                                                    featured,
                                                    password,
                                                    created,
                                                    updated
                                                )
                                                VALUES (
                                                    ${db.escape(prevRoom.ownerId)},
                                                    ${db.escape(prevRoom.type)},
                                                    ${db.escape(prevRoom.mode)},
                                                    ${db.escape(prevRoom.featured)},
                                                    ${db.escape(prevRoom.password)},
                                                    UNIX_TIMESTAMP(),
                                                    UNIX_TIMESTAMP()
                                                )`);

                if (result.insertId) {
                    const code = createRoomCode(result.insertId);
                    room = {
                        id: result.insertId,
                        type: "private",
                        created: Date.now() / 1000,
                        updated: Date.now() / 1000,
                        code
                    };
                } else {
                    throw new HTTPError("Could not create party");
                }

                let memberRes = await db.query(`INSERT INTO roomParticipants
                                                (
                                                    roomId,
                                                    userId,
                                                    \`role\`,
                                                    moderator,
                                                    created,
                                                    updated
                                                )
                                                SELECT ${db.escape(room.id)}, userId, role, moderator, UNIX_TIMESTAMP(), UNIX_TIMESTAMP()
                                                FROM roomParticipants
                                                WHERE roomId=${db.escape(prevRoom.id)}
                                              `);
                if (memberRes.affectedRows > 0) {
                    return {
                        data: {
                            ...room,
                            member: {
                                roomId: room.id,
                                userId: currentUserId,
                                moderator: prevMember.moderator,
                                role: prevMember.role,
                                rtcToken: createRTCToken(currentUserId, room.id, prevMember.role)
                            }
                        }
                    };
                } else {
                    throw new HTTPError("Could not create participant");
                }
            } else {
                if (!roomType) {
                    throw new HTTPError("No room type specified");
                }
                if (!roomMode) {
                    roomMode = "video";
                }
                if (roomType == "public") {
                    let currentUser = await getUser(currentUserId);
                    let currentRoom = (
                        await db.query(
                            `SELECT * from rooms where type="public" ownerId=${db.escape(
                                currentUserId
                            )} AND updated > UNIX_TIMESTAMP() - 60*60 ORDER BY updated DESC`
                        )
                    )[0];
                    if (currentRoom) {
                        room = currentRoom;
                        let member = await getParticipant(room.id, currentUserId);
                        return {
                            data: {
                                ...room,
                                member
                            }
                        };
                    } else {
                        let featured = 1;
                        if (unlisted) {
                            featured = 0;
                        } else if (currentUser.featured) {
                            featured = currentUser.featured;
                        }
                        let result = await db.query(`INSERT INTO rooms
                                                (
                                                    ownerId,
                                                    type,
                                                    mode,
                                                    featured,
                                                    password,
                                                    created,
                                                    updated
                                                )
                                                VALUES (
                                                    ${db.escape(currentUserId)},
                                                    "public",
                                                    ${db.escape(roomMode)},
                                                    ${db.escape(featured)},
                                                    ${db.escape(password)},
                                                    UNIX_TIMESTAMP(),
                                                    UNIX_TIMESTAMP()
                                                )`);
                        if (result.insertId) {
                            room = {
                                id: result.insertId,
                                type: "public",
                                created: Date.now() / 1000,
                                updated: Date.now() / 1000
                            };
                        } else {
                            throw new HTTPError("Could not create party");
                        }
                    }
                } else {
                    let result = await db.query(`INSERT INTO rooms
                                                (
                                                    ownerId,
                                                    type,
                                                    mode,
                                                    featured,
                                                    password,
                                                    created,
                                                    updated
                                                )
                                                VALUES (
                                                    ${db.escape(currentUserId)},
                                                    "private",
                                                    ${db.escape(roomMode)},
                                                    0,
                                                    ${db.escape(password)},
                                                    UNIX_TIMESTAMP(),
                                                    UNIX_TIMESTAMP()
                                                )`);
                    if (result.insertId) {
                        const code = createRoomCode(result.insertId);
                        room = {
                            id: result.insertId,
                            type: "private",
                            created: Date.now() / 1000,
                            updated: Date.now() / 1000,
                            code
                        };
                    } else {
                        throw new HTTPError("Could not create party");
                    }
                }
                if (room) {
                    let memberRes = await db.query(`INSERT INTO roomParticipants
                                                (
                                                    roomId,
                                                    userId,
                                                    \`role\`,
                                                    moderator,
                                                    created,
                                                    updated
                                                )
                                                VALUES (
                                                    ${db.escape(room.id)},
                                                    ${db.escape(currentUserId)},
                                                    "owner",
                                                    1,
                                                    UNIX_TIMESTAMP(),
                                                    UNIX_TIMESTAMP()
                                                )`);
                    if (memberRes.affectedRows > 0) {
                        return {
                            data: {
                                ...room,
                                member: {
                                    roomId: room.id,
                                    userId: currentUserId,
                                    moderator: 1,
                                    role: "owner",
                                    rtcToken: createRTCToken(currentUserId, room.id, "owner")
                                }
                            }
                        };
                    } else {
                        throw new HTTPError("Could not create participant");
                    }
                }
            }
            return room;
        }
        case "GET": {
            //get list of recent rooms

            if (!currentUserId) {
                throw new HTTPError("Not signed in.");
            }

            let participants = await db.query(`select  roomParticipants.*, usersNew.id, usersNew.username, usersNew.displayName, usersNew.profileImageUrl, currentActivity.roomId as activityRoomId, currentActivity.updated as activityUpdated from roomParticipants
            JOIN usersNew ON roomParticipants.userId=usersNew.id
            JOIN currentActivity ON roomParticipants.userId=currentActivity.userId
            where roomParticipants.roomId IN
            (select rooms.id from roomParticipants JOIN rooms ON rooms.id=roomParticipants.roomId
            WHERE roomParticipants.userId=${db.escape(currentUserId)} AND rooms.type="private" ORDER BY rooms.updated DESC) LIMIT 200`);

            participants = db.parse(participants);
            let rooms = {};
            participants.forEach((p) => {
                if (!rooms[p.roomId]) {
                    rooms[p.roomId] = { id: p.roomId, created: p.created, updated: p.updated, participants: [] };
                }
                if (p.activityRoomId == p.roomId && p.activityUpdated > Date.now() / 1000 - 120) {
                    p.active = true;
                }
                rooms[p.roomId].participants.push(p);
                if (p.created > rooms[p.roomId].created) {
                    rooms[p.roomId].created = p.created;
                }
                if (p.updated > rooms[p.roomId].updated) {
                    rooms[p.roomId].updated = p.updated;
                }
            });

            let uniqueRooms = {};
            for (let k in rooms) {
                let r = rooms[k];
                let name = r.participants
                    .sort((a, b) => b.id - a.id)
                    .map((p) => p.username)
                    .join(",");
                if (!uniqueRooms[name] || uniqueRooms[name].updated < r.updated) {
                    uniqueRooms[name] = {
                        ...r,
                        activeParticipants: r.participants.filter((p) => p.active)
                    };
                }
            }

            return {
                data: Object.values(uniqueRooms)
                    .filter((r) => r.participants.length > 1)
                    .map((r) => {
                        r.code = createRoomCode(r.id);
                        return r;
                    }),
                headers: { "cache-control": "max-age=60" }
            };
        }
        case "PUT": {
            break;
        }
        case "DELETE": {
            break;
        }
    }
    return response;
});
export default handler;
