const api = require("lib/api");
const { normalizePhone } = require("utils/phone");
const db = require("lib/db");
const handler = async function (req, res, { currentUserId, currentAccountType }) {
    const { checkUsername } = require("lib/filter");
    const HTTPError = require("lib/HTTPError");
    // Rest of the API logic
    const { query } = req;
    let response = {};

    switch (req.method) {
        case "POST": {
            //create new anonymous user
            break;
        }
        case "GET": {
            //login
            const { email, username, phone } = query;

            if (email) {
                let result = await db.query(`SELECT id from usersNew
                where email=${db.escape(email.toLowerCase().trim())} OR emailHash=md5(${db.escape(email.toLowerCase().trim())}) LIMIT 1`);
                return { data: { unique: result.length == 0, email } };
            } else if (phone) {
                let result = await db.query(`SELECT id from usersNew
                where phone=${db.escape(normalizePhone(phone))} OR phoneHash=md5(${db.escape(normalizePhone(phone))}) LIMIT 1`);
                return { data: { unique: result.length == 0, phone } };
            } else if (username) {
                if (!checkUsername(username.toLowerCase())) {
                    return { data: { unique: false, username } };
                }
                let result = await db.query(`SELECT id from usersNew
                where username=${db.escape(username.toLowerCase().trim())}  OR usernameHash=md5(${db.escape(
                    username.toLowerCase().trim()
                )}) LIMIT 1`);
                return { data: { unique: result.length == 0, username } };
            } else {
                throw new HTTPError("Missing username or email.");
            }
        }
        case "PUT": {
            break;
        }
        case "DELETE": {
            break;
        }
    }
    return response;
};
export default api(handler);
