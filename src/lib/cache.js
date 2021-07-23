const LRU = require("lru-cache");
const path = require("path");
const fs = require("fs");
const cache = new LRU({
    max: 500,
    maxAge: 1000 * 60 * 60,
    length: (d) => {
        try {
            return JSON.stringify(d).length;
        } catch (e) {
            return 1;
        }
    }
});
const cachePath = path.resolve(__dirname, "/tmp/cache.json");
const ANONYMOUS_ROUTES = [/\/users\/featured/gi, /\/content/gi, /\/events\/([0-9]+?)/gi, /\/users\/([0-9]+?)\/relationships/gi];

module.exports.loadAll = () => {
    try {
        if (fs.existsSync(cachePath)) {
            let data = fs.readFileSync(cachePath);
            if (data) {
                let cachedData = JSON.parse(data);
                cache.load(cachedData);
                return true;
            }
            return false;
        }
    } catch (e) {
        console.log(e);
        return;
    }
};

module.exports.writeAll = () => {
    try {
        let data = cache.dump();
        fs.writeFileSync(cachePath, JSON.stringify(data));
        return true;
    } catch (e) {
        console.log(e);
        return;
    }
};

module.exports.checkCache = (req, res, userData) => {
    // console.log(req.method);
    if (req.method != "GET") {
        return null;
    }

    this.loadAll();
    //  console.log("CHECKCACHE", cache.has(this.getCacheKey(req, res, userData), cache));
    if (cache.has(this.getCacheKey(req, res, userData))) {
        //   console.log("CACHE HIT");
        res.setHeader("x-cache", "HIT");
        return cache.get(this.getCacheKey(req, res, userData));
    } else {
        return null;
    }
};

module.exports.getCacheKey = (req, res, userData) => {
    let currentUserId = "";
    if (userData) {
        currentUserId = userData.currentUserId;
    }
    let anonymous = false;
    ANONYMOUS_ROUTES.forEach((rx) => {
        if (rx.test(req.url)) {
            anonymous = true;
        }
    });
    if (anonymous) {
        //   console.log("Anonymous", req.url);
        return req.url;
    } else {
        return req.url + "_" + currentUserId;
    }
};
module.exports.set = (...args) => {
    cache.set(...args);
    return this.writeAll();
};
module.exports.get = (...args) => cache.get(...args);
module.exports.lru = cache;
