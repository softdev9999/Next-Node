const api = require("lib/api");
const db = require("lib/db");

const handler = async function (req, _res, { currentUserId }) {
    const { hashPassword, checkPassword } = require("lib/auth");
    const { userObject, getUser, getUserByName } = require("lib/user");
    const HTTPError = require("lib/HTTPError");
    const crypt = require("lib/crypt");
    const { checkUsername } = require("lib/filter");
    const {
        query: { userId },
        body
    } = req;
    // Rest of the API logic
    let response = {};

    switch (req.method) {
        case "POST": {
            console.log(body);
            break;
        }
        case "GET": {
            //get single user
            break;
        }
        case "PUT": {
            //update user
            console.log(currentUserId, body);
            if (!body || !currentUserId || !body.deviceToken || !body.deviceType) {
                throw new HTTPError("Nothing to update.");
            }

            let userDeviceRes = await db.query(
                `INSERT INTO userDevices 
                (userId, type, address, active,created, updated) 
                VALUES(
                    ${db.escape(currentUserId)}, ${db.escape(body.deviceType)},${db.escape(body.deviceToken)},1, UNIX_TIMESTAMP(), UNIX_TIMESTAMP()
                ) 
                ON DUPLICATE KEY UPDATE userId=${db.escape(currentUserId)}, active=1, updated=UNIX_TIMESTAMP()`
            );
            return { data: { success: userDeviceRes.affectedRows > 0 } };
        }
        case "DELETE": {
            if (!body || !currentUserId || !body.deviceToken || !body.deviceType) {
                throw new HTTPError("Nothing to update.");
            }
            let userDeviceRes = await db.query(
                `update userDevices set active=0 where 
                userId=${db.escape(currentUserId)} AND 
                type=${db.escape(body.deviceType)} AND 
                address=${db.escape(body.deviceToken)} LIMIT 1`
            );
            return { data: { success: userDeviceRes.affectedRows > 0 } };
        }
    }
    return response;
};

export default api(handler);
