const api = require("lib/api");

const handler = function (req, res, { currentUserId }) {
    // Rest of the API logic
    const { checkText } = require("lib/filter");
    let response = {};
    const { body } = req;
    switch (req.method) {
        case "POST": {
            if (body && body.text) {
                if (!checkText(body.text)) {
                    return { data: { success: false } };
                } else {
                    let limitingFactor = 0;
                    if (!body.viewerCount) {
                        body.viewerCount = 1;
                    }
                    if (body.viewerCount > 4000) {
                        limitingFactor = 0.7;
                    } else if (body.viewerCount > 3000) {
                        limitingFactor = 0.5;
                    } else if (body.viewerCount > 2000) {
                        limitingFactor = 0.3;
                    } else if (body.viewerCount > 1000) {
                        limitingFactor = 0.2;
                    }
                    if (Math.random() >= limitingFactor) {
                        return { data: { success: true } };
                    } else {
                        return { data: { success: false } };
                    }
                }
            }
            break;
        }
        case "GET": {
            break;
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
