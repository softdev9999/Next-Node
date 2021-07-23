const Cors = require("cors");
const { initMiddleware } = require("./middleware");
const { verifyAuthorizationCookie, ACCOUNT_TYPE } = require("./auth");
const nookies = require("nookies");
const cache = require("./cache");
const HTTPError = require("./HTTPError");
const db = require("lib/db");
const { ErrorOutlineRounded } = require("@material-ui/icons");

module.exports = function (handler, options) {
    if (!options) {
        options = {
            // Only allow requests with GET, POST and OPTIONS
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
        };
    }
    const cors = initMiddleware(
        // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
        Cors(options)
    );

    // the rest of your app

    return async function (req, res) {
        await cors(req, res);
        let userData = {};
        let decoded = {};
        try {
            decoded = verifyAuthorizationCookie({ req });
            if (decoded) {
                userData.currentUserId = decoded.id;
                userData.currentAccountType = decoded.type;
            } else {
                userData.currentAccountType = ACCOUNT_TYPE.NONE;
                userData.currentUserId = null;
            }
        } catch (e) {
            userData.currentAccountType = ACCOUNT_TYPE.NONE;
            userData.currentUserId = null;
        }

        try {
            let apiRes = {};
            let cacheHeader = req.headers["cache-control"] || req.headers["Cache-Control"];
            let useCache = req.method.toUpperCase() == "GET";
            if (cacheHeader && (cacheHeader.toLowerCase() == "no-cache" || cacheHeader.toLowerCase() == "none")) {
                useCache = false;
            }
            if (useCache) {
                apiRes.data = cache.checkCache(req, res, userData);
            }
            if (!apiRes.data) {
                res.setHeader("x-cache", "MISS");
                apiRes = await handler(req, res, userData);
                //  console.log(cache.get(cache.getCacheKey(req, res, userData)));
            } else {
                //  console.log("CACHE HIT!", apiRes.data, req.url);
            }
            let { data, error, cookies, headers } = apiRes;
            if (cookies) {
                for (let k in cookies) {
                    if (cookies[k]) {
                        nookies.setCookie({ res }, k, cookies[k], {
                            maxAge: 90 * 24 * 60 * 60,
                            domain: process.env.NEXT_PUBLIC_STAGE == "dev" ? "localhost" : "scener.com",

                            secure: true,
                            sameSite: "strict",
                            path: "/"
                        });
                    }
                }
            }
            let maxAge = 0;
            if (headers) {
                for (let h in headers) {
                    res.setHeader(h, headers[h]);
                    if (h == "cache-control") {
                        let matches = /max-age=([0-9]+)/gi.exec(headers[h]);
                        if (matches && !isNaN(matches[1])) {
                            maxAge = parseInt(matches[1], 10) * 1000;
                        }
                    }
                }
            }
            if (!error && useCache && maxAge > 0) {
                cache.set(cache.getCacheKey(req, res, userData), apiRes.data, maxAge);
            }
            await db.end();

            res.status(200).json({ data, error });
        } catch (e) {
            await db.end();
            let err = e;
            if (!(e instanceof HTTPError)) {
                console.log(e);
                err = e.toJSON();
            }
            if (err && !err.code) {
                err.code = 400;
            }
            res.setHeader("cache-control", "no-cache");
            res.status(e.code).json({ error: err ? err : { message: "Something went wrong" } });
        }
    };
};
