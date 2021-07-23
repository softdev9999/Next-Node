const { createToken } = require("./auth");
const { ACCOUNT_TYPE } = require("../hooks/AuthState/AuthConstants");
const db = require("lib/db");
module.exports.getUser = async (userId, extended = true) => {
    let user = (
        await db.query(
            `SELECT usersNew.id, username, displayName,  profileImageUrl, bannerImageUrl, wallImageUrl,email, hidden,phone, verified,  unsubscribed,userStats.*
                    FROM usersNew 
                          LEFT JOIN userStats on userStats.userId=usersNew.id
                      where usersNew.id=${db.escape(userId)} AND deleted IS NULL LIMIT 1`
        )
    )[0];
    let userData = db.parse(user);
    if (user && user.id && extended) {
        userData.profile = {};
        const extendedData = await db.query(`SELECT * from userProfileContent WHERE userId=${db.escape(user.id)}`);
        for (let info of extendedData) {
            userData.profile[info.field] = info.content;
        }
    }
    return userData;
};

module.exports.getUserByName = async (userName, extended) => {
    let user = (
        await db.query(
            `SELECT usersNew.id, username, displayName,  profileImageUrl, bannerImageUrl, wallImageUrl,phone, email, hidden, verified, userStats.*
  
                    FROM usersNew      LEFT JOIN userStats on userStats.userId=usersNew.id
                      where usersNew.username=${db.escape(userName)} AND deleted IS NULL LIMIT 1`
        )
    )[0];

    let userData = db.parse(user);

    if (user && user.id && extended) {
        userData.profile = {};

        const extendedData = await db.query(`SELECT * from userProfileContent WHERE userId=${db.escape(user.id)}`);
        for (let info of extendedData) {
            userData.profile[info.field] = info.content;
        }
    }
    return userData;
};

module.exports.getRelationships = async (userId, cursor = 0, count = 500) => {
    //      LEFT JOIN relationships ro on (ro.fromUserId=r.fromUserId and ro.fromUserId = ${db.escape(otherUserId)})

    let rels = await db.query(`SELECT  r.status, r.toUserId, r.fromUserId, r.updated from relationships r
      where r.toUserId=${db.escape(userId)} OR r.fromUserId=${db.escape(userId)} ORDER BY r.updated DESC LIMIT ${count} OFFSET ${cursor}`);
    rels = db.parse(rels);
    let result = {};
    for (let i in rels) {
        let id = rels[i].fromUserId == userId ? rels[i].toUserId : rels[i].fromUserId;
        if (!result[id]) {
            result[id] = { id, from: null, to: null, updated: rels[i].updated };
        }
        if (rels[i].fromUserId == userId) {
            result[id].to = rels[i].status;
        } else if (rels[i].toUserId == userId) {
            result[id].from = rels[i].status;
        }
    }
    return result;
};

module.exports.getFollowing = async (userId, cursor = 0, count = 50) => {
    //      LEFT JOIN relationships ro on (ro.fromUserId=r.fromUserId and ro.fromUserId = ${db.escape(otherUserId)})

    let rels = await db.query(`SELECT r.status, r.toUserId, r.fromUserId, u.id, u.displayName, u.username, u.profileImageUrl, u.deleted, userStats.* from relationships r
      LEFT JOIN userStats on userStats.userId=r.toUserId
      RIGHT JOIN usersNew u on u.id=r.toUserId
      where  r.fromUserId=${db.escape(
          userId
      )} AND r.status="following" AND u.deleted IS NULL AND u.username IS NOT NULL  AND u.username != ""  ORDER BY r.updated DESC LIMIT ${count} OFFSET ${cursor}`);
    console.log(rels);
    rels = rels.map((u) => {
        return this.userObject(u, false).user;
    });

    return { items: rels, cursor: parseInt(cursor, 10) + rels.length };
};

module.exports.getFollowers = async (userId, cursor = 0, count = 50) => {
    //      LEFT JOIN relationships ro on (ro.fromUserId=r.fromUserId and ro.fromUserId = ${db.escape(otherUserId)})

    let rels = await db.query(`SELECT r.status, r.toUserId, r.fromUserId, u.id, u.displayName, u.username, u.profileImageUrl, u.deleted,userStats.* from relationships r
      LEFT JOIN userStats on userStats.userId=r.fromUserId
      RIGHT JOIN usersNew u on u.id=r.fromUserId
      where  r.toUserId=${db.escape(
          userId
      )} AND r.status="following" AND u.deleted IS NULL AND u.username IS NOT NULL AND u.username != "" ORDER BY r.updated DESC LIMIT ${count} OFFSET ${cursor}`);
    rels = rels.map((u) => {
        return this.userObject(u, false).user;
    });

    return { items: rels, cursor: parseInt(cursor, 10) + rels.length };
};

module.exports.getBlocked = async (userId, cursor = 0, count = 50) => {
    //      LEFT JOIN relationships ro on (ro.fromUserId=r.fromUserId and ro.fromUserId = ${db.escape(otherUserId)})

    let rels = await db.query(`SELECT  r.status, r.toUserId, r.fromUserId, u.id, u.displayName, u.username, u.profileImageUrl, u.deleted, userStats.* from relationships r
      RIGHT JOIN usersNew u on u.id=r.toUserId
        LEFT JOIN userStats on userStats.userId=r.toUserId
      where  r.fromUserId=${db.escape(userId)}
      AND r.status="blocked" AND u.deleted IS NULL  AND u.username IS NOT NULL  AND u.username != ""  ORDER BY r.updated DESC LIMIT ${count} OFFSET ${cursor}`);

    rels = rels.map((u) => {
        return this.userObject(u, false).user;
    });

    return { items: rels, cursor: parseInt(cursor, 10) + rels.length };
};

module.exports.getFeaturedUsers = async (userId, cursor = 0, count = 20) => {
    let feats = await db.query(`SELECT u.featured, u.verified, u.id , u.displayName, u.username, u.profileImageUrl, userStats.* from usersNew u
      LEFT JOIN userStats on userStats.userId=u.id
      WHERE deleted IS NULL AND u.featured > 0
      order by u.featured desc limit ${count} offset ${cursor}`);
    if (feats && feats.length) {
        if (userId) {
            let rels = await this.getRelationships(userId);
            feats = feats.filter((u) => {
                return (userId != u.id && !rels[u.id]) || rels[u.id] == "none";
            });
        }

        feats = feats.map((u) => {
            return this.userObject(u, false).user;
        });
    } else {
        feats = [];
    }
    return { items: feats, cursor: parseInt(cursor, 10) + feats.length };
};

module.exports.getLiveNow = async (userId, cursor = 0, count = 20) => {
    let feats = await db.query(`SELECT r.code,r.featured,r.previewKey,r.type, ca.roomId, ca.userId, ca.live, ca.updated, rp.role,
      u.id, u.username, u.displayName, u.verified, u.profileImageUrl, u.bannerImageUrl, u.wallImageUrl from rooms r
      LEFT JOIN roomParticipants rp on rp.userId=r.ownerId AND rp.roomId=r.id
      LEFT JOIN currentActivity ca on ca.roomId=r.id AND r.ownerId=ca.userId
      LEFT JOIN usersNew u on u.id=ca.userId
      where ca.live = 1 and ca.updated > (UNIX_TIMESTAMP() - 120)  AND deleted IS NULL AND ca.contentId IS NOT NULL AND r.featured > 0 AND u.featured >0 AND rp.role="owner"
      order by r.featured desc, r.maxUsers desc limit ${count} OFFSET ${cursor}`);
    if (feats && feats.length) {
        let rels = await this.getRelationships(userId);
        feats = feats
            .filter((u) => {
                return !rels[u.id] || (rels[u.id].to != "blocked" && rels[u.id].from != "banned");
            })
            .map((u) => {
                return this.userObject(u, false).user;
            });
    } else {
        feats = [];
    }
    return { items: feats, cursor: parseInt(cursor, 10) + feats.length };
};

module.exports.getRelationship = async (userId, otherUserId) => {
    let rels = await db.query(
        `SELECT * from relationships where (fromUserId=${db.escape(otherUserId)} AND toUserId=${db.escape(userId)}) OR (toUserId=${db.escape(
            otherUserId
        )} AND fromUserId=${db.escape(userId)})  LIMIT 2`
    );
    let from = rels.find((r) => r.fromUserId == userId);
    let to = rels.find((r) => r.toUserId == userId);
    return { to, from };
};

module.exports.userObject = (data, isCurrent = false) => {
    if (!data || (!data.userId && !data.id)) {
        return { user: null };
    }
    let user = { activity: {} };
    let token = null;
    if (data.id) {
        user.id = data.id;
    }
    if (data.username) {
        user.username = data.username;
    }
    if (data.displayName) {
        user.displayName = data.displayName;
    } else if (data.username) {
        user.displayName = data.username;
    }
    if (data.profileImageUrl) {
        user.profileImageUrl = data.profileImageUrl;
    }
    if (data.bannerImageUrl) {
        user.bannerImageUrl = data.bannerImageUrl;
    }
    if (data.wallImageUrl) {
        user.wallImageUrl = data.wallImageUrl;
    }
    if (data.verified) {
        user.verified = data.verified;
    }

    if (data.hidden) {
        user.hidden = data.hidden;
    }

    user.followerCount = data.followerCount || 0;

    user.followingCount = data.followingCount || 0;

    user.viewerCount = data.viewerCount || 0;

    user.popularity = data.popularity || 0;

    // can later map the setting to user.hidden
    // later can use userSettings table for this
    // import service settings here later

    user.relationship = {};
    if (data.status) {
        user.relationship.status = data.status;
    }
    if (data.fromUserId) {
        user.relationship.fromUserId = data.fromUserId;
    }
    if (data.toUserId) {
        user.relationship.toUserId = data.toUserId;
    }
    if (data.updated && data.updated >= Date.now() / 1000 - 2 * 60) {
        if (data.contentId) {
            user.activity.contentId = data.contentId;
        }
        if (data.title) {
            user.activity.title = data.title;
        }
        if (data.subtitle) {
            user.activity.subtitle = data.subtitle;
        }
        if (data.updated) {
            user.activity.updated = data.updated;
        }
        if (data.img) {
            user.activity.img = data.img;
        }
        if (data.roomId) {
            user.activity.roomId = data.roomId;
        }
        if (data.service) {
            user.activity.service = data.service;
        }
        if (data.url) {
            user.activity.url = data.url;
        }
        if (data.timeline) {
            user.activity.timeline = data.timeline;
        }
        if (data.duration) {
            user.activity.duration = data.duration;
        }
        user.activity.live = !!data.live;
    }
    if (data.profile) {
        for (let k in data.profile) {
            if (typeof user[k] === "undefined") {
                user[k] = data.profile[k];
            }
        }
    }

    if (isCurrent) {
        if (data.email) {
            user.email = data.email;
        }
        if (data.phone) {
            user.phone = data.phone;
        }
        if (data.unsubscribed) {
            user.unsubscribed = data.unsubscribed;
        }

        user.settings = {
            hideOverlay: data.hidden || "featured"
        };
        user.loggedIn = true;
        token = createToken(data.id, user.verified ? ACCOUNT_TYPE.VERIFIED : user.username ? ACCOUNT_TYPE.AUTHED : ACCOUNT_TYPE.ANONYMOUS);
    }
    return { user, token };
};

module.exports.saveTracking = async (userId, tracking) => {
    let insertStatement = [];

    for (let tag in tracking) {
        insertStatement.push(`(${db.escape(userId)}, ${db.escape(tag)},${db.escape(tracking[tag])}, UNIX_TIMESTAMP())`);
    }

    let trackingRes = await db.query("INSERT IGNORE INTO userTracking (userId, tag,`value`, created) VALUES " + insertStatement.join(","));
    console.log(trackingRes);
    return trackingRes.affectedRows > 0;
};
