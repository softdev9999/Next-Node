const mysql = require("serverless-mysql");

const db = mysql({
    config: {
        host: process.env.DB_HOSTNAME,
        database: process.env.DB_NAME,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        charset: "utf8mb4"
    }
});

module.exports.query = async (query, timeout = 5000) => {
    try {
        const results = await db.query({ sql: query, timeout });
        return results;
    } catch (error) {
        return { error };
    }
};

module.exports.escape = (d) => db.escape(d);

module.exports.parse = (d) => (typeof d !== "undefined" ? JSON.parse(JSON.stringify(d)) : null);

module.exports.end = () => db.end();

module.exports.quit = () => db.quit();
