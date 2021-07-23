const api = require("lib/api");
const db = require("lib/db");

const handler = async function (req, _res, { currentUserId }) {
    const { hashPassword, checkPassword } = require("lib/auth");
    const { userObject, getUser, getUserByName } = require("lib/user");
    const HTTPError = require("lib/HTTPError");
    const crypt = require("lib/crypt");
    const { checkUsername } = require("lib/filter");
    const { normalizePhone, validatePhone } = require("utils/phone");

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
            if (userId == "null" || userId == "undefined") {
                return { data: {} };
            }
            let user = null;
            if ((userId + "").match(/^[0-9]+$/i)) {
                user = await getUser(userId, true);
            } else {
                user = await getUserByName(userId, true);
            }
            if (user && user.id) {
                let d = userObject(user, user.id == currentUserId);

                return { data: d.user, headers: { "cache-control": d.token ? "no-cache" : "max-age=60" } };
            } else {
                throw new HTTPError("User not found", 404);
            }
        }
        case "PUT": {
            //update user
            if (!body) {
                throw new HTTPError("Nothing to update.");
            }

            if (userId && body.resetPassword && body.resetToken) {
                let userDecr = crypt.decrypt(body.resetToken);
                let userDecrParsed = JSON.parse(userDecr);

                let resetCheck = null;

                if (userDecrParsed && userDecrParsed.email) {
                    resetCheck = await db.query(
                        `SELECT id from usersNew where email=${db.escape(userDecrParsed.email.toLowerCase().trim())} LIMIT 1`
                    );
                } else if (userDecrParsed && userDecrParsed.phone) {
                    resetCheck = await db.query(
                        `SELECT id from usersNew where phone=${db.escape(userDecrParsed.phone.toLowerCase().trim())} LIMIT 1`
                    );
                }

                if (resetCheck) {
                    let userResCheck = db.parse(resetCheck)[0];
                    currentUserId = userResCheck && userResCheck.id;
                }
            }

            if (userId == currentUserId) {
                let user = (
                    await db.query(
                        `SELECT id, username, displayName,  profileImageUrl, bannerImageUrl, wallImageUrl, email, phone, verified, password
                        FROM usersNew where id=${db.escape(userId)} AND deleted IS NULL LIMIT 1`
                    )
                )[0];
                if (!user) {
                    throw new HTTPError("Account not found");
                }
                if (
                    (((!user.username && !body.username) || (!user.password && !body.resetPassword)) && !body.resetToken) ||
                    (!user.email && !user.phone)
                ) {
                    //sort of new user (updating for first time)
                    throw new HTTPError("Create an account first", 401);
                }
                let updatedUser = Object.assign({}, user);
                let updates = [];

                if (body.displayName && body.displayName != user.displayName) {
                    if (body.displayName.length < 1 || body.displayName.length > 32) {
                        throw new HTTPError("Invalid display name", 400, { field: "displayName" });
                    }

                    updates.push(`displayName=${db.escape(body.displayName)}`);
                    updatedUser.displayName = body.displayName;
                }

                if (Object.prototype.hasOwnProperty.call(body, "hidden")) {
                    updates.push(`hidden=${db.escape(body.hidden)}`);
                    updatedUser.hidden = body.hidden;
                }
                if (!user.username && !body.username && body.resetToken) {
                    throw new HTTPError("Please set a username.", 400, { field: "username" });
                } else if (body.username && body.username.toLowerCase() != user.username) {
                    if (
                        body.username.length < 3 ||
                        body.username.length > 20 ||
                        !/^[a-zA-Z0-9._]*$/gi.test(body.username) ||
                        !checkUsername(body.username.toLowerCase())
                    ) {
                        throw new HTTPError("Invalid username", 400, { field: "username" });
                    }
                    let usernameCheck = await db.query(
                        `SELECT id, username, displayName,  profileImageUrl, bannerImageUrl, wallImageUrl, email, verified
                        FROM usersNew where username=${db.escape(body.username.toLowerCase())} OR usernameHash=md5(${db.escape(
                            body.username.toLowerCase()
                        )})  LIMIT 1`
                    );
                    if (usernameCheck.length > 0) {
                        throw new HTTPError("Username already in use", 400, { field: "username" });
                    }
                    updates.push(`username=${db.escape(body.username.toLowerCase())}, usernameHash=md5(${db.escape(body.username.toLowerCase())})`);
                    updatedUser.username = body.username.toLowerCase();
                    //check username
                }
                if (body.phone && body.phone != user.phone) {
                    if (!validatePhone(body.phone)) {
                        throw new HTTPError("Invalid phone number", 400, { field: "phone" });
                    }
                    let normalizedPhone = normalizePhone(body.phone);

                    let phoneCheck = await db.query(
                        `SELECT id, username, displayName,  profileImageUrl, bannerImageUrl, wallImageUrl, email, phone, verified
                                FROM usersNew where phone=${db.escape(normalizedPhone)} OR phoneHash=md5(${db.escape(normalizedPhone)})  LIMIT 1`
                    );
                    if (phoneCheck.length) {
                        throw new HTTPError("Phone number in use.", 400, { field: "phone" });
                    }
                    updates.push(`phone=${db.escape(normalizedPhone)}, phoneHash=md5(${db.escape(normalizedPhone)})`);
                    updatedUser.phone = normalizedPhone;
                }
                if (body.email && body.email.toLowerCase() != user.email) {
                    if (body.email.length < 3 || body.email.length > 64 || !/^.+@([\w-]+\.)+[\w-]{2,6}$/gi.test(body.email)) {
                        throw new HTTPError("Invalid email", 400, { field: "email" });
                    }
                    let emailCheck = await db.query(
                        `SELECT id, username, displayName,  profileImageUrl, bannerImageUrl, wallImageUrl, email, verified
                                FROM usersNew where email=${db.escape(body.email.toLowerCase())} OR emailHash=md5(${db.escape(
                            body.email.toLowerCase()
                        )})  LIMIT 1`
                    );
                    if (emailCheck.length) {
                        throw new HTTPError("Email already in use.", 400, { field: "email" });
                    }
                    updates.push(`email=${db.escape(body.email.toLowerCase())},  emailHash=md5(${db.escape(updatedUser.email)})`);
                    updatedUser.email = body.email.toLowerCase();
                }

                if (body.resetPassword) {
                    if (body.resetPassword.length < 8 || body.resetPassword.length > 60) {
                        throw new HTTPError("Invalid password", 400, { field: "password" });
                    }

                    updates.push(`password=${db.escape(hashPassword(body.resetPassword))}`);
                } else if ((!body.password || !checkPassword(body.password, user.password)) && body.newPassword) {
                    throw new HTTPError("Must provide current password", 400, { field: "password" });
                } else {
                    if (body.newPassword && user.password && user.password.replace("$2y", "$2b") != hashPassword(body.password)) {
                        if (body.newPassword.length < 8 || body.newPassword.length > 60) {
                            throw new HTTPError("Invalid password", 400, { field: "password" });
                        }

                        updates.push(`password=${db.escape(hashPassword(body.newPassword))}`);
                    }
                }
                if (typeof body.unsubscribed !== "undefined" && body.unsubscribed != user.unsubscribed) {
                    updates.push(`unsubscribed=${body.unsubscribed ? "UNIX_TIMESTAMP()" : "NULL"}`);
                }
                if (updates.length) {
                    let updateResult = await db.query(`UPDATE usersNew set ${updates.join(",")} where id=${db.escape(currentUserId)} LIMIT 1`);
                    if (!updateResult || updateResult.affectedRows == 0) {
                        throw new HTTPError("Failed to update user.", 400);
                    }
                }

                let { user: u, token: t } = userObject(updatedUser, true);
                response = { data: u, cookies: { "Auth-Token": t } };

                if (body.profile) {
                    let fieldUpdates = [];

                    for (let field in body.profile) {
                        fieldUpdates.push(
                            db.query(
                                `INSERT INTO userProfileContent (userId, field, content)
                            VALUES(${db.escape(currentUserId)},${db.escape(field)},${db.escape(body.profile[field])})
                            ON DUPLICATE KEY UPDATE content=${db.escape(body.profile[field])}
                            `
                            )
                        );
                        response.data[field] = body.profile[field];
                    }
                    await Promise.all(fieldUpdates);
                }
                if (body.tracking) {
                    let insertStatement = [];
                    for (let tag in body.tracking) {
                        insertStatement.push(
                            `VALUES(${db.escape(updatedUser.id)}, ${db.escape(tag)},${db.escape(body.tracking[tag])}, UNIX_TIMESTAMP())`
                        );
                    }

                    let r = await db.query(
                        `INSERT IGNORE INTO userTracking (userId, tag,value, created)
                 ` + insertStatement.join(",\n")
                    );
                    console.log(r);
                }
            }
            break;
        }
        case "DELETE": {
            break;
        }
    }
    return response;
};

export default api(handler);
