const api = require("lib/api");
const handler = async function (req, res, { currentUserId }) {
    const { userObject, getUser } = require("lib/user");

    let response = {};

    switch (req.method) {
        case "POST": {
            break;
        }
        case "GET": {
            //login

            if (currentUserId) {
                /* if (req.headers && (!req.headers.referer || !req.headers.web)) {
                    return { data: null };
                }*/
                let user = await getUser(currentUserId, true);
                const { user: data, token } = userObject(user, true);
                return { data, cookies: { "Auth-Token": token } };
            } else {
                return { data: null, cookies: { "Auth-Token": null } };
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
