const api = require("lib/api");
const { getPhoneVerificationCheck, sendPhoneVerification } = require("lib/twilio");
const { normalizePhone } = require("utils/phone");
const { encrypt } = require("lib/crypt");
const HTTPError = require("lib/HTTPError");

const handler = async function (req /*, res, { currentUserId, currentAccountType }*/) {
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
            const { phone, code, crypt } = query;

            if (phone) {
                //throw new HTTPError(phone);
                let phoneNumber = normalizePhone(phone);

                try {
                    if (code) {
                        response = await getPhoneVerificationCheck(phoneNumber, code);

                        if (response && response.status && response.status == "approved" && crypt) {
                            // generate a crypt response to be used for verification later
                            let resetOb = {
                                phone: phoneNumber,
                                ts: Math.floor(Date.now() / 1000)
                            };

                            response.crypt = encrypt(JSON.stringify(resetOb));
                        }
                    } else {
                        response = await sendPhoneVerification(phoneNumber);
                    }

                    return { data: response };
                } catch (e) {
                    console.log("ERROR ***", e);
                    throw new HTTPError("SMS Internal Error.");
                }
            } else {
                throw new HTTPError("Missing phone and/or code.");
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
