const AccessToken = require("./agora/AccessToken").AccessToken;
const Privileges = require("./agora/AccessToken").privileges;
const appId = process.env.AGORA_APPID;
const cert = process.env.AGORA_CERT;
const SCENER_USER_ID_INDIVIDUAL = 1;
const SCENER_USER_ID_MIX = 2;

module.exports.createRTCToken = function (uid, channelName, role) {
    //   console.log("create agora token", uid, channelName, role);
    let key = new AccessToken(appId, cert, channelName + "", uid + "");
    let privilegeExpiredTs = Date.now() / 1000 + 6 * 60 * 60;
    key.addPrivilege(Privileges.kJoinChannel, privilegeExpiredTs);
    if (role == "owner" || role == "host") {
        key.addPrivilege(Privileges.kPublishAudioStream, privilegeExpiredTs);
        key.addPrivilege(Privileges.kPublishVideoStream, privilegeExpiredTs);
        key.addPrivilege(Privileges.kPublishDataStream, privilegeExpiredTs);
    }
    let t = key.build();
    let checkKey = new AccessToken(appId, cert, channelName + "", uid + "");
    checkKey.fromString(t);
    //  console.log(checkKey);
    return t;
};

module.exports.createRTMToken = function (uid) {
    const key = new AccessToken(appId, cert, uid + "", "");
    key.addPrivilege(Privileges.kRtmLogin, Date.now() / 1000 + 6 * 60 * 60);
    return key.build();
};

module.exports.apiRequest = (endpoint, body, method = "GET") => {
    let authHeader = Buffer.from(process.env.AGORA_AUTH_TOKEN).toString("base64");

    let baseUrl = "https://api.agora.io/v1/apps/" + process.env["AGORA_APPID"] + "/cloud_recording/";
    let params = {
        headers: {
            Authorization: "Basic " + authHeader,
            "Content-Type": "application/json;charset=utf-8"
        },
        method
    };
    if (body) {
        params.body = JSON.stringify(body);
    }
    console.log(params);
    return fetch(baseUrl + endpoint, params)
        .then((d) => d.json())
        .then((r) => {
            console.log(r);
            return r;
        })
        .catch((e) => {
            throw e;
        });
};

module.exports.aquireRecordingResource = ({ roomId, userId }) => {
    if (roomId) {
        return this.apiRequest("acquire", { cname: roomId + "", uid: userId + "", clientRequest: { resourceExpiredHour: 24 } }, "POST");
    } else {
        throw "no room id";
    }
};

module.exports.startRecording = ({ roomId, mode }) => {
    if (!mode) {
        mode = "individual";
    }
    let userId = mode == "individual" ? SCENER_USER_ID_INDIVIDUAL : SCENER_USER_ID_MIX;

    return this.aquireRecordingResource({ roomId, userId }).then(({ resourceId }) => {
        if (resourceId) {
            let authToken = this.createRTCToken(userId, roomId, "owner");
            let recordingConfig = {};
            if (mode == "individual") {
                recordingConfig = {
                    cname: roomId + "",
                    uid: userId + "",
                    clientRequest: {
                        token: authToken,
                        recordingConfig: {
                            maxIdleTime: 30,
                            streamTypes: 2,
                            channelType: 1,
                            videoStreamType: 0,
                            subscribeUidGroup: 1

                            /*"transcodingConfig" : {
                            "height" : 360,
                            "width" : 640,
                            "bitrate" : 500,
                            "fps" : 15,
                            "mixedVideoLayout" : 1,
                            "backgroundColor" : "#FFFFFF",
                            //This is where layout stuff can go
                        },*/
                        },

                        recordingFileConfig: {
                            avFileType: ["hls"]
                        },
                        storageConfig: {
                            accessKey: process.env["AGORA_S3_KEY"],
                            region: 3,
                            bucket: process.env["AGORA_S3_BUCKET"],
                            secretKey: process.env["AGORA_S3_SECRET"],
                            vendor: 1,
                            fileNamePrefix: ["room", roomId + "", "recordings"]
                        }
                    }
                };
            } else {
                recordingConfig = {
                    cname: roomId + "",
                    uid: userId,
                    clientRequest: {
                        token: authToken,
                        recordingConfig: {
                            maxIdleTime: 30,
                            streamTypes: 2,
                            channelType: 1,
                            videoStreamType: 0,

                            transcodingConfig: {
                                height: 360,
                                width: 640,
                                bitrate: 500,
                                fps: 15,
                                mixedVideoLayout: 1,
                                backgroundColor: "#FFFFFF"
                                //This is where layout stuff can go
                            }
                        },

                        recordingFileConfig: {
                            avFileType: ["hls"]
                        },
                        storageConfig: {
                            accessKey: process.env["AGORA_S3_KEY"],
                            region: 3,
                            bucket: process.env["AGORA_S3_BUCKET"],
                            secretKey: process.env["AGORA_S3_SECRET"],
                            vendor: 1,
                            fileNamePrefix: ["room", roomId + "", "recordings"]
                        }
                    }
                };
            }
            return this.apiRequest(["resourceid", resourceId, "mode", mode, "start"].join("/"), recordingConfig, "POST");
        } else {
            throw "resource id missing";
        }
    });
};

module.exports.stopRecording = ({ roomId, resourceId, sid, mode }) => {
    if (!mode) {
        mode = "individual";
    }
    let userId = mode == "individual" ? SCENER_USER_ID_INDIVIDUAL : SCENER_USER_ID_MIX;

    return this.apiRequest(
        ["resourceid", resourceId, "sid", sid, "mode", mode, "stop"].join("/"),
        {
            cname: roomId + "",
            uid: userId + "",
            clientRequest: {}
        },
        "POST"
    );
};

module.exports.queryRecording = ({ resourceId, sid, mode }) => {
    if (!mode) {
        mode = "individual";
    }
    return this.apiRequest(["resourceid", resourceId, "sid", sid, "mode", mode, "query"].join("/"), null, "GET");
};
