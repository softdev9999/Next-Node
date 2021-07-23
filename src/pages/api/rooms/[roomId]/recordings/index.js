const HTTPError = require("lib/HTTPError");
const api = require("lib/api");

const handler = async function (req, res_, { currentUserId }) {
    // Rest of the API logic
    const { getRoom /*, getParticipant*/ } = require("lib/room");
    const { createRecording, endRecording, getRecordingsForRoom } = require("lib/recordings");

    let response = {};
    const {
        query: { roomId },
        body
    } = req;
    let userId = body.userId;
    if (req.headers && req.headers["x-scener"] && req.headers["x-scener"] == process.env.JWT_KEY && userId) {
        let room = await getRoom(roomId);

        switch (req.method) {
            case "POST": {
                //start recording

                if (room.type == "public") {
                    let result = await createRecording(roomId, "individual");
                    if (result) {
                        return { data: result };
                    } else {
                        throw new HTTPError("Could not start recording");
                    }
                }

                break;
            }
            case "GET": {
                if (room.type == "public") {
                    let result = await getRecordingsForRoom(roomId);
                    if (result) {
                        return { data: result };
                    } else {
                        throw new HTTPError("Could not start recording");
                    }
                }

                break;
            }
            case "PUT": {
                break;
            }
            case "DELETE": {
                if (room.type == "public") {
                    let result = await endRecording(roomId, "individual");
                    if (result) {
                        return { data: result };
                    } else {
                        throw new HTTPError("Could not stop recording");
                    }
                }

                break;
            }
        }
        return response;
    } else {
        throw new HTTPError("Not authorized", 401);
    }
};
export default api(handler);
