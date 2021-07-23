const api = require("lib/api");
const { normalizePhone } = require("utils/phone");
const { sendDownloadLinkEmail } = require("lib/email");
const db = require("lib/db");

const handler = async function (req, res, { currentUserId, currentAccountType }) {
    const { checkUsername } = require("lib/filter");
    const { createToken, checkPassword, hashPassword } = require("lib/auth");
    const { userObject, getUser, saveTracking } = require("lib/user");
    const HTTPError = require("lib/HTTPError");
    // Rest of the API logic
    const { query, body } = req;
    let response = {};

    switch (req.method) {
        case "POST": {
            if (body.email && body.sendLink) {
                //create new anonymous user with email and send link to download on desktop
                let id = currentUserId;
                let [user] = await db.query(
                    `SELECT id, username, phone, displayName,  birthday, profileImageUrl, bannerImageUrl, wallImageUrl, email, verified, password
                        FROM usersNew
                        where emailHash=MD5(${db.escape(body.email)}) LIMIT 1`
                );
                if (!currentUserId && !user) {
                    let insertResult = await db.query(
                        `INSERT INTO usersNew (email,emailHash,created,updated) 
                        VALUES(${db.escape(body.email)},MD5(${db.escape(body.email)}),UNIX_TIMESTAMP(), UNIX_TIMESTAMP())`
                    );
                    id = insertResult.insertId;
                    if (body.tracking) {
                        await saveTracking(id, body.tracking);
                    }
                    if (!id) {
                        throw new HTTPError("Could not send download link.");
                    }
                }
                let emailRes = await sendDownloadLinkEmail(body.email);
                if (!emailRes) {
                    throw new HTTPError("Could not send download link.");
                }
                return { data: { id }, cookies: { "Auth-Token": createToken(id) } };
            } else {
                //create new anonymous user

                if (!currentUserId) {
                    let insertResult = await db.query(`INSERT INTO usersNew (created,updated) VALUES(UNIX_TIMESTAMP(), UNIX_TIMESTAMP())`);
                    let id = insertResult.insertId;
                    if (id) {
                        return { data: { id }, cookies: { "Auth-Token": createToken(id) } };
                    } else {
                        throw new HTTPError("Could not create anonymous user.");
                    }
                } else {
                    return { data: { id: currentUserId }, cookies: { "Auth-Token": createToken(currentUserId, currentAccountType) } };
                }
            }
        }
        case "GET": {
            //login
            const { password, username } = query;
            if (!password && !username && currentUserId) {
                let user = await getUser(currentUserId, true);
                const { user: data, token } = userObject(user, true);
                return { data, cookies: { "Auth-Token": token } };
            }
            if (!password || !username) {
                throw new HTTPError("Missing username or password.");
            }
            let user = (
                await db.query(
                    `SELECT id, username, phone, displayName,  birthday, profileImageUrl, bannerImageUrl, wallImageUrl, email, verified, password
                        FROM usersNew
                        where username=${db.escape(username.toLowerCase())} OR email=${db.escape(username.toLowerCase())} OR phone=${db.escape(
                        normalizePhone(username)
                    )}
                        AND deleted IS NULL LIMIT 1`
                )
            )[0];
            if (user && user.password && checkPassword(password, user.password.replace("$2y", "$2b"))) {
                if (currentUserId && currentUserId != user["id"]) {
                    let originalUser = await db.query(`SELECT id FROM usersNew where id=${db.escape(user.id)} AND deleted IS NULL LIMIT 1`);
                    console.log(originalUser);
                    if (originalUser.length)
                        await db.query(`UPDATE IGNORE roomParticipants SET userId=${db.escape(user["id"])} WHERE userId=${db.escape(currentUserId)}`);
                }
                user = await getUser(user.id, true);

                const { user: data, token } = userObject(user, true);
                return { data, cookies: { "Auth-Token": token } };
            } else {
                throw new HTTPError("Incorrect username or password");
            }
        }
        case "PUT": {
            if (!body) {
                throw new HTTPError("Body is empty.");
            }
            let user = null;
            if (currentUserId) {
                user = (
                    await db.query(
                        `SELECT id, username, displayName,  birthday, profileImageUrl, bannerImageUrl, wallImageUrl, email, phone, verified, password
                        FROM usersNew where id=${db.escape(currentUserId)} AND deleted IS NULL LIMIT 1`
                    )
                )[0];
            } else if (body.email) {
                user = (
                    await db.query(
                        `SELECT id, username, displayName,  birthday, profileImageUrl, bannerImageUrl, wallImageUrl, email, phone, verified, password
                        FROM usersNew where email=${db.escape(body.email.toLowerCase().trim())} AND password IS NULL AND deleted IS NULL LIMIT 1`
                    )
                )[0];
            }

            if (!user) {
                let insertResult = await db.query(`INSERT INTO usersNew (created,updated) VALUES(UNIX_TIMESTAMP(), UNIX_TIMESTAMP())`);
                let id = insertResult.insertId;
                if (id) {
                    user = { id };
                } else {
                    throw new HTTPError("Could not create anonymous user.");
                }
            }
            if (!user.username) {
                //sort of new user (updating for first time)
                if (!body.username) {
                    throw new HTTPError("Username required", 400, { field: "username" });
                }
                if (!body.email) {
                    throw new HTTPError("Email required", 400, { field: "email" });
                }
                /*if (!body.phone) {
                    throw new HTTPError("Phone number required", 400, { field: "phone" });
                }*/
                if (!body.password) {
                    throw new HTTPError("Password required", 400, { field: "password" });
                }
            }
            let updatedUser = Object.assign({}, user);
            let updates = [];
            if (body.username && body.username.toLowerCase() != user.username) {
                if (
                    body.username.length < 3 ||
                    body.username.length > 20 ||
                    !/^[a-zA-Z0-9._]*$/gi.test(body.username) ||
                    !checkUsername(body.username.toLowerCase())
                ) {
                    throw new HTTPError("Invalid username", 400, { field: "username" });
                }
                let usernameCheck = await db.query(
                    `SELECT id, username, displayName,  birthday, profileImageUrl, bannerImageUrl, wallImageUrl, email, verified
                        FROM usersNew where username=${db.escape(body.username.toLowerCase())}  OR usernameHash=md5(${db.escape(
                        body.username.toLowerCase()
                    )}) LIMIT 1`
                );
                if (usernameCheck.length > 0) {
                    throw new HTTPError("Username already in use", 400, { field: "username" });
                }
                updates.push(`username=${db.escape(body.username.toLowerCase())}, usernameHash=md5(${db.escape(body.username.toLowerCase())})`);
                updatedUser.username = body.username.toLowerCase();
                //check username
            }

            if (body.email && body.email.toLowerCase() != user.email) {
                if (body.email.length < 3 || body.email.length > 64 || !/^.+@([\w-]+\.)+[\w-]{2,6}$/gi.test(body.email)) {
                    throw new HTTPError("Invalid email", 400, { field: "email" });
                }
                let emailCheck = await db.query(
                    `SELECT id, username, displayName,  birthday, profileImageUrl, bannerImageUrl, wallImageUrl, email, verified
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

            if (body.phone && body.phone.toLowerCase() != user.phone) {
                /*if (body.phone.length < 3 || body.phone.length > 64 || !/^.+@([\w-]+\.)+[\w-]{2,6}$/gi.test(body.phone)) {
                    throw new HTTPError("Invalid phone number", 400, { field: "phone" });
                }*/
                let phoneCheck = await db.query(
                    `SELECT id, username, displayName,  birthday, profileImageUrl, bannerImageUrl, wallImageUrl, email, phone, verified
                        FROM usersNew where phone=${db.escape(normalizePhone(body.phone))} OR phoneHash=md5(${db.escape(
                        body.phone.toLowerCase()
                    )})  LIMIT 1`
                );
                if (phoneCheck.length) {
                    throw new HTTPError("Phone number already in use.", 400, { field: "phone" });
                }
                updates.push(`phone=${db.escape(normalizePhone(body.phone))}, phoneHash=md5(${db.escape(normalizePhone(body.phone))})`);
                updatedUser.phone = normalizePhone(body.phone);
            }

            if (body.displayName && body.displayName != user.displayName) {
                if (body.displayName.length < 3 || body.displayName.length > 32) {
                    throw new HTTPError("Invalid display name", 400, { field: "displayName" });
                }

                updates.push(`displayName=${db.escape(body.displayName)}`);
                updatedUser.displayName = body.displayName;
            }
            if (body.password && !user.password) {
                if (body.password.length < 8 || body.password.length > 60) {
                    throw new HTTPError("Invalid password", 400, { field: "password" });
                }

                updates.push(`password=${db.escape(hashPassword(body.password))}`);
            }
            if (body.birthday) {
                let birthday = parseInt(body.birthday);
                let curTime = Math.floor(Date.now() / 1000);

                if (curTime - birthday < 86400 * 365 * 13) {
                    throw new HTTPError("Invalid birthday date, or out of acceptable range", 400, { field: "birthday" });
                }

                updates.push(`birthday=${db.escape(birthday)}`);
            }
            if (updates.length) {
                let updateResult = await db.query(`UPDATE usersNew set ${updates.join(",")} where id=${db.escape(user.id)} LIMIT 1`);
                if (!updateResult || updateResult.affectedRows == 0) {
                    throw new HTTPError("Failed to update user.");
                }
            }
            updatedUser.profile = {};
            if (body.profile) {
                let fieldUpdates = [];

                for (let field in body.profile) {
                    fieldUpdates.push(
                        db.query(
                            `INSERT INTO userProfileContent (userId, field, content)
                            VALUES(${db.escape(user.id)},${db.escape(field)},${db.escape(body.profile[field])})
                            ON DUPLICATE KEY UPDATE content=${db.escape(body.profile[field])}
                            `
                        )
                    );
                    updatedUser.profile[field] = body.profile[field];
                }
                await Promise.all(fieldUpdates);
            }
            if (body.tracking) {
                await saveTracking(updatedUser.id, body.tracking);
            }
            const { user: data, token } = userObject(updatedUser, true);
            return { data, cookies: { "Auth-Token": token } };
        }
        case "DELETE": {
            if (!currentUserId) {
                throw new HTTPError("User not found or not logged in.");
            }
            let result = await db.query(
                `UPDATE usersNew set username=NULL,verified=NULL, email=NULL, phone=NULL, displayName=NULL, unsubscribed=1,deleted=UNIX_TIMESTAMP(), profileImageUrl=NULL, bannerImageUrl=NULL, wallImageUrl=NULL WHERE id=${db.escape(
                    currentUserId
                )}`
            );
            if (result.affectedRows) {
                return { data: { success: true } };
            } else {
                throw new HTTPError("Could not delete user.");
            }
        }
    }
    return response;
};
export default api(handler);
