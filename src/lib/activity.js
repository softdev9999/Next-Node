const db = require("lib/db");

module.exports.getActivity = async (userId) => {
    let q = `SELECT  ca.*, role, ci.duration, ci.service, c.title, ci.subtitle, c.img, ci.url, ci.seriesNumber, ci.episodeNumber, ci.paid, ci.live as liveVideo from currentActivity ca
    LEFT JOIN roomParticipants on ca.userId=roomParticipants.userId AND ca.roomId=roomParticipants.roomId
    LEFT JOIN contentItems ci ON ci.id=ca.contentItemsId
    LEFT JOIN content c ON c.id=ca.contentId
    WHERE ca.userId=${db.escape(userId)} AND (ca.updated > UNIX_TIMESTAMP() - 120) LIMIT 1`;
    let result = (await db.query(q))[0];
    return db.parse(result) || {};
};

module.exports.getMultiActivity = async (userIds) => {
    let q = `SELECT  ca.*, role, ci.duration, ci.service, c.title, ci.subtitle, ci.img, ci.url, ci.live as liveVideo, ci.paid,
    ci.seriesNumber, ci.episodeNumber from currentActivity ca
    LEFT JOIN roomParticipants on ca.userId=roomParticipants.userId AND ca.roomId=roomParticipants.roomId
    LEFT JOIN contentItems ci ON ci.id=ca.contentItemsId
    LEFT JOIN content c ON c.id=ca.contentId
    WHERE ca.userId IN (${userIds.map((uid) => db.escape(uid)).join(",")}) AND (ca.updated > UNIX_TIMESTAMP() - 120) LIMIT 1`;
    let result = await db.query(q);
    return db.parse(result) || [];
};

module.exports.updateCurrentActivity = (activity) => {
    return db.query(`INSERT INTO currentActivity
                            (
                                userId,
                                contentId,
                                contentItemsId,
                                roomId,
                                isMobile,
                                extension,
                                timeline,
                                live,
                                service,
                                updated
                            )
                            VALUES(
                                ${db.escape(activity.userId)},
                                ${db.escape(activity.contentId)},
                                ${db.escape(activity.contentItemsId)},
                                ${db.escape(activity.roomId)},
                                ${db.escape(activity.isMobile)},
                                ${db.escape(activity.extension)},
                                ${db.escape(activity.timeline)},
                                ${db.escape(activity.isLive)},
                                ${db.escape(activity.service)},
                                UNIX_TIMESTAMP()
                            )
                            ON DUPLICATE KEY UPDATE
                                contentId=${db.escape(activity.contentId)},
                                contentItemsId=${db.escape(activity.contentItemsId)},
                                roomId=${db.escape(activity.roomId)},
                                isMobile= ${db.escape(activity.isMobile)},
                                extension=${db.escape(activity.extension)},
                                timeline=${db.escape(activity.timeline)},
                                live=${db.escape(activity.isLive)},
                                service=${db.escape(activity.service)},
                                updated=UNIX_TIMESTAMP()`);
};

module.exports.updateUserActivity = async (activity) => {
    let latest = (
        await db.query(`SELECT updated, service FROM activity WHERE
                    userId=${db.escape(activity.userId)}
                    AND day=UNIX_TIMESTAMP(current_date)
                    AND contentId=${db.escape(activity.contentId)}
                    AND isMobile=${db.escape(activity.mobile)}
                    AND extension=${db.escape(activity.extension)}
                    AND roomId=${db.escape(activity.roomId)}
                    AND videoEnabled=${db.escape(activity.video)}
                    AND audioEnabled=${db.escape(activity.audio)},
                    AND updated > (UNIX_TIMESTAMP()-60) LIMIT 1`)
    )[0];

    if (!latest || latest.service != activity.service) {
        await db.query(`INSERT INTO activity
                            (
                                userId,
                                day,
                                contentId,
                                roomId,
                                audioEnabled,
                                videoEnabled,
                                isMobile,
                                extension,
                                timeline,
                                service,
                                minutes, 
                                created,
                                updated
                            )
                            VALUES(
                                ${db.escape(activity.userId)},
                                UNIX_TIMESTAMP(current_date),
                                ${db.escape(activity.contentId)},
                                ${db.escape(activity.roomId)},
                                ${db.escape(activity.audio)},
                                ${db.escape(activity.video)},
                                ${db.escape(activity.isMobile)},
                                ${db.escape(activity.extension)},
                                ${db.escape(activity.timeline)},
                                ${db.escape(activity.service)},

                                1,
                                UNIX_TIMESTAMP(),
                                UNIX_TIMESTAMP()
                            )
                            ON DUPLICATE KEY UPDATE
                            minutes=minutes+1,
                            timeline=${db.escape(activity.timeline)},
                            updated=UNIX_TIMESTAMP()`);
        if (activity.roomId > 0) {
            await db.query(`INSERT INTO activityRooms
                            (
                                roomId,
                                day,
                                contentId,
                                timeline,
                                minutes,
                                created,
                                updated
                            )
                            VALUES(
                                ${db.escape(activity.roomId)},
                                UNIX_TIMESTAMP(current_date),
                                ${db.escape(activity.contentId)},
                                ${db.escape(activity.timeline)},
                                1,
                                UNIX_TIMESTAMP(),
                                UNIX_TIMESTAMP()
                            )
                            ON DUPLICATE KEY UPDATE
                                minutes=minutes+1,
                                timeline=${db.escape(activity.timeline)},
                                updated=UNIX_TIMESTAMP()`);
        }
    }
    return activity;
};

module.exports.updateRoomActivity = async (activity) => {
    const { getParticipant } = require("./room");
    let member = await getParticipant(activity.roomId, activity.userId);
    if (member.role == "owner" || member.role == "host") {
        const AWS = require("aws-sdk");
        const sqs = new AWS.SQS({ region: "us-west-2" });
        await db.query(
            `UPDATE roomParticipants set updated=UNIX_TIMESTAMP()
                            where roomId=${db.escape(activity.roomId)} AND userId=${db.escape(activity.userId)} LIMIT 1`
        );
        let latest = (await db.query(`SELECT * from roomActivity where roomId=${db.escape(activity.roomId)} ORDER BY updated DESC LIMIT 1`))[0];
        let res = null;
        if (
            !latest ||
            latest.contentId != activity.contentId ||
            latest.contentItemsId != activity.contentItemsId ||
            latest.service != activity.service
        ) {
            //insert new
            res = await db.query(`INSERT INTO 
                                    roomActivity (
                                        roomId,
                                        contentId,
                                        contentItemsId,
                                        service,
                                        viewerCount, 
                                        created,
                                        updated
                                        )
                                    VALUES(
                                        ${db.escape(activity.roomId)},
                                        ${db.escape(activity.contentId)},
                                        ${db.escape(activity.contentItemsId)},
                                        ${db.escape(activity.service)},
                                        ${db.escape(Math.max(activity.viewerCount, 0))},
                                        UNIX_TIMESTAMP(),
                                        UNIX_TIMESTAMP()
                                    )`);
        } else {
            //update latest
            res = await db.query(
                `UPDATE roomActivity SET updated=UNIX_TIMESTAMP(), viewerCount=${db.escape(
                    Math.max(Math.max(latest.viewerCount, activity.viewerCount), 0)
                )} WHERE id=${db.escape(latest.id)} LIMIT 1`
            );
        }
        try {
            let params = {
                MessageBody: JSON.stringify({ eventName: "activityUpdated", activity }),
                QueueUrl: process.env.SQS_URL /* required */
            };
            await sqs.sendMessage(params).promise();
        } catch (e) {
            console.log(e);
        }
        return res;
    } else {
        return true;
    }
};

module.exports.prepareActivity = (activity) => {
    let res = { ...activity };
    res.userId = activity.userId;
    res.roomId = activity.roomId || 0;
    res.contentId = activity.contentId || 0;
    res.contentItemsId = activity.contentItemsId || 0;
    if (activity.currentTime && activity.currentTime > 0) {
        res.timeline = Math.round(activity.currentTime / 1000);
    } else {
        res.timeline = 0;
    }
    res.extension = !activity.isExtensionInstalled ? 0 : 1;
    res.audio = activity.audio ? 1 : 0;
    res.video = activity.video ? 1 : 0;
    res.isMobile = activity.isMobile ? 1 : 0;
    res.isLive = activity.live ? 1 : 0;
    res.viewerCount = activity.viewerCount || 1;
    res.service = activity.service;
    return res;
};
