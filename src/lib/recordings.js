const HTTPError = require("./HTTPError");
const db = require("lib/db");

module.exports.getRecordingsForRoom = async (roomId) => {
    let recording = await db.query(`SELECT * from recordings where roomId=${db.escape(roomId)}`);
    return db.parse(recording[0]);
};

module.exports.getActiveRecording = async (roomId, mode) => {
    let recording = await db.query(
        `SELECT * from recordings where roomId=${db.escape(roomId)} and mode=${db.escape(mode)} AND status=1 ORDER BY created  DESC LIMIT 1`
    );
    console.log(recording);
    return db.parse(recording[0]);
};

module.exports.createRecording = async (roomId, mode) => {
    try {
        const { startRecording } = require("./agora");
        let { resourceId, sid } = await startRecording({ roomId, mode });
        console.log(resourceId, sid);
        if (resourceId && sid) {
            let recording = await db.query(`INSERT INTO recordings (roomId, resourceId, sid, mode, status,created) 
    VALUES(${db.escape(roomId)},${db.escape(resourceId)},${db.escape(sid)},${db.escape(mode)},1, UNIX_TIMESTAMP())`);
            console.log(recording);

            return db.escape({ resourceId, sid, mode, roomId, status: 1 });
        }

        throw new HTTPError("Could not start recording");
    } catch (e_) {
        throw new HTTPError("Could not start recording");
    }
};

module.exports.endRecording = async (roomId, mode) => {
    try {
        const { stopRecording } = require("./agora");

        let { resourceId, sid } = await this.getActiveRecording(roomId, mode);
        if (resourceId && sid) {
            await stopRecording({ roomId, resourceId, sid });
            let recording = await db.query(
                `UPDATE recordings set status=0 
            where roomId=${db.escape(roomId)} 
            AND sid=${db.escape(sid)}`
            );
            return recording.affectedRows > 0;
        } else {
            throw new HTTPError("Not found");
        }
    } catch (e_) {
        throw new HTTPError("Not found");
    }
};
