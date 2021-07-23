const api = require("lib/api");
const HTTPError = require("lib/HTTPError");
export const config = {
    api: {
        bodyParser: false
    }
};
const db = require("lib/db");

const handler = function (req, res, { currentUserId }) {
    const img = require("lib/images");
    const {
        query: { userId, imageKey }
    } = req;
    // Rest of the API logic
    let response = {};

    switch (req.method) {
        case "POST": {
            if (userId != currentUserId) {
                throw new HTTPError("Not authenticated", 401);
            }
            return new Promise((resolve, reject) => {
                let contentBuffer = [];
                let totalBytesInBuffer = 0;
                let maxFileSize = 2 * 1024 * 1024;
                req.on("data", (chunk) => {
                    contentBuffer.push(chunk);
                    totalBytesInBuffer += chunk.length;

                    // Look to see if the file size is too large.
                    if (totalBytesInBuffer > maxFileSize) {
                        req.pause();

                        res.header("Connection", "close");
                        res.status(413).json({ error: `The file size exceeded the limit of ${maxFileSize} bytes` });

                        req.connection.destroy();
                    }
                });

                // Could happen if the client cancels the upload.
                req.on("aborted", function () {
                    // Nothing to do with buffering, garbage collection will clean everything up.
                    reject(new HTTPError("Aborted upload"));
                });

                req.on("end", async function () {
                    contentBuffer = Buffer.concat(contentBuffer, totalBytesInBuffer);
                    let imgProps = null;
                    let dbField = null;
                    switch (imageKey) {
                        case "profile": {
                            imgProps = {
                                height: 300,
                                width: 300
                            };
                            dbField = "profileImageUrl";
                            break;
                        }
                        case "banner": {
                            imgProps = {
                                height: 600,
                                width: 1500
                            };
                            dbField = "bannerImageUrl";
                            break;
                        }
                        case "wall": {
                            imgProps = {
                                height: 1500,
                                width: 1500
                            };
                            dbField = "wallImageUrl";
                            break;
                        }
                        default: {
                            reject(new HTTPError("invalid image key"));
                            return;
                        }
                    }
                    let newUrl = await img.createResponsiveImagesAndUpload({
                        image: contentBuffer,
                        ...imgProps,
                        userId,
                        key: imageKey,
                        format: "jpeg"
                    });
                    if (newUrl) {
                        await db.query(`UPDATE usersNew set ${dbField}=${db.escape(newUrl)} WHERE id=${db.escape(currentUserId)} LIMIT 1`);

                        resolve({ data: { [dbField]: newUrl } });
                    } else {
                        throw new HTTPError("Could not upload");
                    }
                });
            });
        }
        case "GET": {
            //get single user

            break;
        }
        case "PUT": {
            //update user

            break;
        }
        case "DELETE": {
            break;
        }
    }
    return response;
};

export default api(handler);
