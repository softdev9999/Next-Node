const api = require("lib/api");
const HTTPError = require("lib/HTTPError");
const db = require("lib/db");
const handler = async function (req, res, { currentUserId }) {
    // Rest of the API logic

    let response = {};
    const {
        query: { contentId }
    } = req;
    switch (req.method) {
        case "POST": {
            break;
        }
        case "GET": {
            let content = (await db.query(`SELECT * from content WHERE id=${db.escape(contentId)} LIMIT 1`))[0];
            if (content) {
                return { data: db.parse(content), headers: { "Cache-Control": "max-age=86400" } };
            } else {
                throw new HTTPError("Content not found");
            }
        }
        case "PUT": {
            break;
        }
    }
    return response;
};
export default api(handler);
