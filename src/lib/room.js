const dictionary = "B3GK78LPQ2THJ4N5CDV6WMX9Z1";
const base10 = "0123456789";
const hex = "0123456789ABCDEF";
const { md5, convertBase } = require("./utils");
const db = require("lib/db");

module.exports.getRoom = async (roomId, getPassword) => {
    let room = null;
    let username = null;

    let oldCode = (roomId + "")
        .trim()
        .toUpperCase()
        .replace(/[^a-zA-Z0-9]/gi, "");
    if (oldCode.length != 9) {
        oldCode = null;
    }
    if (isNaN(roomId)) {
        username = roomId;
        roomId = this.checkRoomCode(roomId);
    }

    if (!roomId && !oldCode) {
        // live user?
        let roomIdQ = (
            await db.query(`SELECT ca.roomId as roomId from currentActivity ca LEFT JOIN usersNew u on
          ca.userId=u.id WHERE u.username=${db.escape(username)} and ca.live=1 and ca.updated > (UNIX_TIMESTAMP() - 60)`)
        )[0];

        roomIdQ = db.parse(roomIdQ);
        roomId = roomIdQ && roomIdQ.roomId;
        if (!roomId) {
            return null;
        }
    }

    if (roomId) {
        room = (await db.query(`SELECT rooms.* from rooms WHERE rooms.id=${db.escape(roomId)}`))[0];

        room = db.parse(room);
    } else if (oldCode) {
        room = (await db.query(`SELECT rooms.* from rooms WHERE rooms.code=${db.escape(oldCode)}`))[0];

        room = db.parse(room);
    }
    room = this.roomObject(room);
    if (room.type == "public") {
        room.code = username;
        room.username = username;
    }
    //console.log({ roomType: room.type, id: room.id });

    if (!getPassword && room.password) {
        // TODO: cleanup console logs so we dont need this anymore
        //room.password = null; // we dont want this showing up in various places a user can see it
    }

    return room;
};
module.exports.getParticipants = async (roomId) => {
    let participants = [];
    if (roomId) {
        participants = await db.query(
            `SELECT roomParticipants.*, usersNew.username from roomParticipants
            JOIN usersNew on roomParticipants.userId=usersNew.id
            WHERE roomId=${db.escape(roomId)} AND (role='owner' OR role='host')`
        );
        participants = db.parse(participants);
    }
    return participants;
};

module.exports.getBannedList = async (roomId) => {
    let participants = [];
    if (roomId) {
        participants = await db.query(
            `SELECT roomParticipants.*, usersNew.username from roomParticipants
            JOIN usersNew on roomParticipants.userId=usersNew.id
            WHERE roomId=${db.escape(roomId)} AND role='banned'`
        );
        participants = db.parse(participants);
    }
    return participants;
};
module.exports.getParticipant = async (roomId, userId) => {
    let participant = null;
    if (roomId) {
        participant = await db.query(
            `SELECT roomParticipants.*, usersNew.username from roomParticipants
            JOIN usersNew on roomParticipants.userId=usersNew.id
            WHERE roomId=${db.escape(roomId)} AND role!='banned' AND userId=${db.escape(userId)}`
        );
        participant = db.parse(participant[0]);
    }
    return participant;
};
module.exports.createRoomCode = (roomId) => {
    let code = roomId + "";
    //console.log(roomId);
    let m = md5(code).toUpperCase();
    //console.log({ m });
    code = convertBase(code, base10, dictionary);
    //console.log({ code });

    let hash = convertBase(m, hex, dictionary);
    //console.log({ hash });
    hash = hash.substring(0, 15 - code.length);
    //console.log(2, { hash });

    code = hash + "R" + code;
    return [code.substring(0, 4), code.substring(4, 8), code.substring(8, 12), code.substring(12, 16)].join("-").toUpperCase();
};

module.exports.checkRoomCode = (code) => {
    code = (code + "")
        .trim()
        .toUpperCase()
        .replace(/[^a-zA-Z0-9]/gi, "");
    let c = code.split("R")[1];
    let hash = code.split("R")[0];
    //console.log(c, hash);
    if (c && hash) {
        try {
            let roomId = convertBase(c, dictionary, base10);
            let m = md5(roomId + "").toUpperCase();
            //console.log(roomId, " ", m);

            if (convertBase(m, hex, dictionary).substring(0, 15 - c.length) == hash) {
                return roomId;
            }
        } catch (e) {
            console.log(e);
            return false;
        }
    }
    return false;
};

module.exports.roomObject = (data) => {
    if (!data) {
        return null;
    }
    let room = data;
    if (room.type == "live") {
        room.type == "public";
    } else if (room.type == "peer") {
        room.type == "private";
    }
    if (room.type != "public") {
        room.code = this.createRoomCode(room.id);
    }
    if (room.previewKey) {
        room.previewClipPosterUrl = [
            `https://${process.env.S3_BUCKET_USERS}.s3-us-west-2.amazonaws.com`,
            "room",
            room.id,
            "clips",
            room.previewKey + ".jpg"
        ].join("/");
        room.previewClipVideoUrl = [
            `https://${process.env.S3_BUCKET_USERS}.s3-us-west-2.amazonaws.com`,
            "room",
            room.id,
            "clips",

            room.previewKey + ".mp4"
        ].join("/");
    }
    return room;
};
