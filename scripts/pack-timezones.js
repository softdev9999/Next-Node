const fs = require("fs");
const moment = require("moment");
require("../node_modules/moment-timezone/moment-timezone-utils.js");

fs.readFile("./node_modules/moment-timezone/data/packed/latest.json", "utf8", (err, data) => {
    if (!err) {
        let zones = JSON.parse(data).zones;
        let links = JSON.parse(data).links;

        let unpackedData = { zones: [], links: [] };
        for (let z of zones) {
            unpackedData.zones.push(moment.tz.unpack(z));
        }
        for (let l of links) {
            unpackedData.links.push(l);
        }
        let d = moment.tz.filterLinkPack(unpackedData, 2019, 2024);
        fs.writeFile("./public/data/timezone-data.json", JSON.stringify(d), (writeErr) => {
            console.error(writeErr);
        });
    } else {
        console.error(err);
    }
});
