const config = require("../config").default;
const db = require("lib/db");
module.exports.getPopularShows = async (service, userId_, cursor = 0, count = 20) => {
    // THIS is a placeholder one that is meant to be used as a stub while the less efficient queries can be FIXED.
    /*let pops = await db.query(
        `SELECT *, count(title) as popularity from contentLite where service != "youtube" and
        service != "vimeo" and img IS NOT NULL AND img <> "" group by title ORDER BY popularity
        DESC LIMIT ${count} OFFSET ${cursor}`
    );*/

    /*CREATE TRIGGER MVIEW_TRIGGER_ACTIVITY AFTER INSERT ON activity a
    FOR EACH ROW
    BEGIN
    INSERT INTO popularContent pc (id, popularity, service, title, subtitle, duration, img, url)
    SELECT id, 0, service, title, subtitle, duration, img, url FROM contentLite c
    WHERE a.contentid > 0 and a.roomid > 0 and c.id=a.contentid
    ON DUPLICATE KEY UPDATE pc.popularity=pc.popularity+1, title, duration, url
    END;

    popularContent Table:
    id primary key
    popularity index
    service index
    title
    subtitle
    duration
    img
    url*/

    // THIS IS ONLY EFFICIENT WITH THE FOLLOWING INDEXES
    // indexes needed : activity.contentid, roomId, userId, day | contentLite.id , title, img

    /* This popularity is based on "one person vote per show". A single user wont boost the popularity for a show
        by watching the show more than once. This query relies on a UNION join of 2 huge tables, so its very expensive

        1602700000 = start of populating new content */

    /*let pops = await db.query(
        `SELECT COUNT(DISTINCT userId) AS popularity, ci.*,
    c.* from activity a
    LEFT JOIN content c on c.id=a.contentId
    LEFT JOIN contentItems ci on ci.contentId=c.id
    WHERE a.day > (UNIX_TIMESTAMP() - (86400 * 2))
    AND a.roomId > 0
    ` + (service ? ` AND ci.service=${db.escape(service)} ` : ` AND ci.service NOT IN ("youtube", "vimeo") `) + `
    AND c.lookedUp > 0 AND c.img IS NOT NULL
    AND ci.live = 0
    GROUP BY c.id
    ORDER BY popularity DESC LIMIT ${count} OFFSET ${cursor}`
  );*/

    let pops = await db.query(
        `SELECT ci.*,
  c.*, pc.popularity from popularContent pc
  LEFT JOIN content c on pc.id=c.id
  LEFT JOIN contentItems ci on pc.contentItemsId=ci.id
  ${service ? ` WHERE pc.service=${db.escape(service)} ` : ""}
  ORDER BY pc.popularity desc LIMIT ${count} OFFSET ${cursor}`
    );

    /*

    let pops = await db.query(
        `SELECT COUNT(DISTINCT a.userId) AS popularity,
    c.* from activity a
    LEFT JOIN contentLite c on a.contentId=c.id
    WHERE a.day >= (UNIX_TIMESTAMP() - (86400 * 2))
    AND a.roomId > 0
    AND c.img IS NOT NULL  AND c.img <> "" ` +
            (service ? ` AND c.service=${db.escape(service)} ` : "") +
            `
    GROUP BY c.title
    ORDER BY popularity DESC LIMIT ${count} OFFSET ${cursor}`
  );*/

    /* This populatiry is based on approximate max minutes watched per user per content. (most efficient of choices here)
      Users watch time has an impact on popularity */

    /*let pops = await db.query(`SELECT count(distinct(a.roomid)) as popularity,
      sum(r.maxusers) as totalusers, sum(a.minutes) as totalminutes,
      c.* from activityRooms a
      LEFT JOIN contentLite c on c.id=a.contentid
      LEFT JOIN rooms r on a.roomid=r.id
      where c.id > 0
      group by c.title
      order by popularity desc limit 10`);*/

    /* This populatiry is based on actual minutes watched per user per content. (2nd in efficiency)
        Users watch time has an impact on popularity */

    /*let pops = await db.query(`SELECT count(rp.userid) as popularity,
        sum(a.minutes) as totalminutes,
        c.* from activityRooms a
        LEFT JOIN contentLite c on c.id=a.contentid
        LEFT JOIN roomParticipants rp on a.roomid=rp.roomid
        where c.id > 0 AND img IS NOT NULL
        group by c.title
        order by popularity desc limit 10`);*/

    return { items: pops, cursor: parseInt(cursor, 10) + pops.length };
};

/*this.storePopularShows = async () => {

  // truncate table first?
  await db.query(`DELETE from popularContent where 1`);

  return await db.query(
      `INSERT INTO popularContent (id, contentItemsId, popularity, updated, service) SELECT c.id, ci.id, COUNT(DISTINCT userId) AS popularity, NOW(), ci.service from activity a
  LEFT JOIN content c on a.contentId=c.id
    LEFT JOIN contentItems ci on ci.contentId=c.id
      WHERE a.day > (UNIX_TIMESTAMP() - (86400 * 7))
      AND a.roomId > 0
      AND c.lookedUp > 0 AND c.img IS NOT NULL
      AND ci.live = 0
      GROUP BY c.id
      ORDER BY popularity DESC LIMIT 100`

      , 10000);

};*/

module.exports.parseSeriesDetails = function (service, title, subtitle) {
    // parse out various formats for the subtitle and return [X, X, subtitleWithoutNumbers]

    /*
  netflix: S1:E21 Funk / P1:E13 Mr. Oliva / Episode 1391
  hbo: THE SOPRANOS SN 1 / Ep 5 College / Sn 1 Ep 1 The One Where Monica Gets a Roommate
  disney: S1:E1 Science Fair
  funimation: Episode 139 - A Witchs Homecoming
  hulu: Meet the Plaths    S1 E1
  print: Season 3, Ep. 13 Abaddon's Gate
  hotstar: S1 E1 Anekta Diwas at Wilkins Chawla
  peacock: S7 E1: Doubt
  shudder: 2. Mars
  showtime: Season 1 Ep 3: I'm Glad You Called
  */

    let seriesDetails = {
        subtitle: subtitle,
        seriesNumber: null,
        episodeNumber: null
    };

    if (config.SERVICE_LIST[service] && config.SERVICE_LIST[service].episodeParser && subtitle) {
        /* parsed matches will always be last (in case there are more than 1)
    not every service will have matches for all 3. */

        if (config.SERVICE_LIST[service].episodeParser.series) {
            let seriesMatches = subtitle.match(config.SERVICE_LIST[service].episodeParser.series);
            seriesDetails.seriesNumber = seriesMatches ? seriesMatches[seriesMatches.length - 1] : null;
        }
        if (config.SERVICE_LIST[service].episodeParser.episode) {
            let episodeMatches = subtitle.match(config.SERVICE_LIST[service].episodeParser.episode);
            seriesDetails.episodeNumber = episodeMatches ? episodeMatches[episodeMatches.length - 1] : null;
        }
        if (config.SERVICE_LIST[service].episodeParser.title) {
            let titleMatches = subtitle.match(config.SERVICE_LIST[service].episodeParser.title);
            seriesDetails.subtitle = titleMatches ? titleMatches[titleMatches.length - 1] : "";
        }
    }

    return seriesDetails;
};

module.exports.browsingContentIdsForService = async (service) => {
    if (service) {
        let contentId = null;
        let contentItemsId = null;
        let contentItem = (
            await db.query(
                `SELECT id as contentItemsId, contentId from contentItems where videoId=${db.escape("browsing-" + service)} AND service=${db.escape(
                    service
                )}`
            )
        )[0];
        if (contentItem) {
            console.log("found contentItem", contentItem);

            return db.parse(contentItem);
        } else {
            console.log("not found contentItem");

            let content = (await db.query(`SELECT id from content where type="service" AND title="Browsing"`))[0];
            if (!content) {
                content = await db.query(
                    `INSERT INTO content (type, title, img, created, updated, lookedUp)
            VALUES(${db.escape(service)},"Browsing","/images/LiveBrowsing.jpg", UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), UNIX_TIMESTAMP()) `
                );

                if (content && content.insertId) {
                    content = { id: content.insertId };
                }
            }
            if (!content) {
                return { contentId: 0, contentItemsId: 0 };
            } else {
                contentId = content.id;
            }
        }

        if (contentId) {
            let title = "Browsing";
            if (config.SERVICE_LIST[service] && config.SERVICE_LIST[service].name) {
                title += " " + config.SERVICE_LIST[service].name;
            }
            let url = null;
            if (config.SERVICE_LIST[service] && config.SERVICE_LIST[service].start) {
                url = config.SERVICE_LIST[service].start;
            }
            contentItem = await db.query(
                `INSERT INTO contentItems (contentId,videoId,service,url, subtitle, created, updated, lookedUp)
                VALUES(
                    ${db.escape(contentId)},
                    ${db.escape("browsing-" + service)},
                    ${db.escape(service)},
                    ${db.escape(url)},
                    ${db.escape(title)},
                UNIX_TIMESTAMP(),
                UNIX_TIMESTAMP(),
                UNIX_TIMESTAMP()) `
            );

            if (contentItem && contentItem.insertId) {
                contentItem = { id: contentItem.insertId };
            }

            if (!contentItem) {
                contentItemsId = 0;
            } else {
                contentItemsId = contentItem.id;
            }
        }
        return { contentId, contentItemsId };
    }
    return { contentId: 0, contentItemsId: 0 };
};

module.exports.lookupContent = async ({ title, subtitle, metadata, service, contentLive, duration, videoId, url, pay }) => {
    let contentId = 0;
    let contentItemsId = 0;
    title = title.trim().substring(0, 100);
    subtitle = subtitle ? subtitle.trim().substring(0, 100) : "";

    let contentType = subtitle ? "series" : "movie";
    let releaseYear = metadata && metadata.year ? metadata.year : null;
    let description = metadata && metadata.description ? metadata.description : "";
    let paid = pay ? 1 : 0;
    let liveStatus = contentLive ? 1 : 0;
    let timelineDuration = Math.round(duration / 1000);

    if (config.SERVICE_LIST[service] && !config.SERVICE_LIST[service].urlParams) {
        url = url.split("?")[0];
    }

    let seriesDetails = this.parseSeriesDetails(service, title, subtitle);

    //console.log("*** SERIES DETAILS ***", seriesDetails);

    // most accurate way to look up the ID is first checking for a videoID match. Use titles as a fallback
    let contentItemsFound = null;
    let contentFound = null;

    if (videoId) {
        contentItemsFound = (await db.query(`SELECT contentId, id FROM contentItems WHERE videoId=${db.escape(videoId)} LIMIT 1`))[0];
    }

    if (!contentItemsFound) {
        contentFound = (await db.query(`SELECT id FROM content WHERE title=${db.escape(title)} AND type=${db.escape(contentType)} LIMIT 1`))[0];
    }

    if (contentItemsFound) {
        contentId = contentItemsFound.contentId;
        contentItemsId = contentItemsFound.id;
        //console.log("*** FOUND CONTENT ID MATCH ***", contentId);
    } else if (contentFound) {
        contentId = contentFound.id;
        //console.log("*** FOUND CONTENT ID MATCH ***", contentId);
    } else {
        //console.log("*** NO MATCH FOUND FOR ***", title);

        let res = await db.query(`INSERT INTO content
                                    (\`title\`,
                                    \`type\`,
                                    \`description\`,
                                    \`releaseYear\`,
                                    \`created\`,
                                    \`updated\`)
                                    VALUES(
                                    ${db.escape(title)},
                                    ${db.escape(contentType)},
                                    ${db.escape(description)},
                                    ${db.escape(releaseYear)},
                                    UNIX_TIMESTAMP(),
                                    UNIX_TIMESTAMP())`);
        contentId = res.insertId;

        //console.log("*** CREATE ENTRY RESULT ***", res);
    }

    if (contentId && videoId) {
        let resContentItem = await db.query(`INSERT INTO contentItems
                                    (\`contentId\`,
                                    \`videoId\`,
                                    \`service\`,
                                    \`duration\`,
                                    \`subtitle\`,
                                    \`url\`,
                                    \`description\`,
                                    \`seriesNumber\`,
                                    \`episodeNumber\`,
                                    \`live\`,
                                    \`paid\`,
                                    \`created\`,
                                    \`updated\`)
                                    VALUES(
                                    ${db.escape(contentId)},
                                    ${db.escape(videoId)},
                                    ${db.escape(service)},
                                    ${db.escape(timelineDuration)},
                                    ${db.escape(seriesDetails.subtitle)},
                                    ${db.escape(url)},
                                    ${db.escape(description)},
                                    ${db.escape(seriesDetails.seriesNumber)},
                                    ${db.escape(seriesDetails.episodeNumber)},
                                    ${db.escape(liveStatus)},
                                    ${db.escape(paid)},
                                    UNIX_TIMESTAMP(),
                                    UNIX_TIMESTAMP())

                                    ON DUPLICATE KEY UPDATE
                                        videoId=${db.escape(videoId)},
                                        url=${db.escape(url)},
                                        service=${db.escape(service)},
                                        duration=${db.escape(timelineDuration)},
                                        description=${db.escape(description)},
                                        live=${db.escape(liveStatus)},
                                        subtitle=${db.escape(seriesDetails.subtitle)},
                                        seriesNumber=${db.escape(seriesDetails.seriesNumber)},
                                        episodeNumber=${db.escape(seriesDetails.episodeNumber)},
                                        updated=UNIX_TIMESTAMP()`);
        contentItemsId = resContentItem.insertId;
        //console.log("*** CONTENT ITEMS ENTRY ***", resContentItem);
    }

    return { contentId, contentItemsId };
};
