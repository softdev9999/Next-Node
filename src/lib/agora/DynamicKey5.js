let crypto = require("crypto");

let version = "005";
let noUpload = "0";
let audioVideoUpload = "3";

let generatePublicSharingKey = function (appID, appCertificate, channelName, unixTs, randomInt, uid, expiredTs) {
    channelName = channelName.toString();
    return generateDynamicKey(appID, appCertificate, channelName, unixTs, randomInt, uid, expiredTs, null, PUBLIC_SHARING_SERVICE);
};

let generateRecordingKey = function (appID, appCertificate, channelName, unixTs, randomInt, uid, expiredTs) {
    channelName = channelName.toString();
    return generateDynamicKey(appID, appCertificate, channelName, unixTs, randomInt, uid, expiredTs, null, RECORDING_SERVICE);
};

let generateMediaChannelKey = function (appID, appCertificate, channelName, unixTs, randomInt, uid, expiredTs) {
    channelName = channelName.toString();
    return generateDynamicKey(appID, appCertificate, channelName, unixTs, randomInt, uid, expiredTs, null, MEDIA_CHANNEL_SERVICE);
};

let generateInChannelPermissionKey = function (appID, appCertificate, channelName, unixTs, randomInt, uid, expiredTs, permission) {
    let extra = {};
    extra[ALLOW_UPLOAD_IN_CHANNEL] = permission;
    return generateDynamicKey(appID, appCertificate, channelName, unixTs, randomInt, uid, expiredTs, extra, IN_CHANNEL_PERMISSION);
};

let generateDynamicKey = function (appID, appCertificate, channelName, unixTs, randomInt, uid, expiredTs, extra, serviceType) {
    let signature = generateSignature5(appCertificate, serviceType, appID, unixTs, randomInt, channelName, uid, expiredTs, extra);
    let content = DynamicKey5Content({
        serviceType: serviceType,
        signature: signature,
        appID: hexDecode(appID),
        unixTs: unixTs,
        salt: randomInt,
        expiredTs: expiredTs,
        extra: extra
    }).pack();
    return version + content.toString("base64");
};

module.exports.version = version;
module.exports.noUpload = noUpload;
module.exports.audioVideoUpload = audioVideoUpload;
module.exports.generatePublicSharingKey = generatePublicSharingKey;
module.exports.generateRecordingKey = generateRecordingKey;
module.exports.generateMediaChannelKey = generateMediaChannelKey;
module.exports.generateInChannelPermissionKey = generateInChannelPermissionKey;
module.exports.generateDynamicKey = generateDynamicKey;

let generateSignature5 = function (appCertificate, serviceType, appID, unixTs, randomInt, channelName, uid, expiredTs, extra) {
    // decode hex to avoid case problem
    let rawAppID = hexDecode(appID);
    let rawAppCertificate = hexDecode(appCertificate);

    let m = Message({
        serviceType: serviceType,
        appID: rawAppID,
        unixTs: unixTs,
        salt: randomInt,
        channelName: channelName,
        uid: uid,
        expiredTs: expiredTs,
        extra: extra
    });

    let toSign = m.pack();
    return encodeHMac(rawAppCertificate, toSign);
};

let encodeHMac = function (key, message) {
    return crypto.createHmac("sha1", key).update(message).digest("hex").toUpperCase();
};

let hexDecode = function (str) {
    return Buffer.from(str, "hex");
};

let ByteBuf = function () {
    let that = {
        buffer: Buffer.alloc(1024),
        position: 0
    };

    that.buffer.fill(0);

    that.pack = function () {
        let out = Buffer.alloc(that.position);
        that.buffer.copy(out, 0, 0, out.length);
        return out;
    };

    that.putUint16 = function (v) {
        that.buffer.writeUInt16LE(v, that.position);
        that.position += 2;
        return that;
    };

    that.putUint32 = function (v) {
        that.buffer.writeUInt32LE(v, that.position);
        that.position += 4;
        return that;
    };

    that.putBytes = function (bytes) {
        that.putUint16(bytes.length);
        bytes.copy(that.buffer, that.position);
        that.position += bytes.length;
        return that;
    };

    that.putString = function (str) {
        return that.putBytes(Buffer.from(str));
    };

    that.putTreeMap = function (map) {
        if (!map) {
            that.putUint16(0);
            return that;
        }

        that.putUint16(Object.keys(map).length);
        for (let key in map) {
            that.putUint16(key);
            that.putString(map[key]);
        }

        return that;
    };

    return that;
};

let DynamicKey5Content = function (options) {
    options.pack = function () {
        let out = ByteBuf();
        return out
            .putUint16(options.serviceType)
            .putString(options.signature)
            .putBytes(options.appID)
            .putUint32(options.unixTs)
            .putUint32(options.salt)
            .putUint32(options.expiredTs)
            .putTreeMap(options.extra)
            .pack();
    };

    return options;
};

let Message = function (options) {
    options.pack = function () {
        let out = ByteBuf();
        return out
            .putUint16(options.serviceType)
            .putBytes(options.appID)
            .putUint32(options.unixTs)
            .putUint32(options.salt)
            .putString(options.channelName)
            .putUint32(options.uid)
            .putUint32(options.expiredTs)
            .putTreeMap(options.extra)
            .pack();
    };

    return options;
};

// InChannelPermissionKey
let ALLOW_UPLOAD_IN_CHANNEL = 1;

// Service Type
let MEDIA_CHANNEL_SERVICE = 1;
let RECORDING_SERVICE = 2;
let PUBLIC_SHARING_SERVICE = 3;
let IN_CHANNEL_PERMISSION = 4;
