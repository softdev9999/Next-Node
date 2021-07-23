const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports.sendPhoneVerification = function (phone) {
    return client.verify
        .services(process.env.TWILIO_VERIFY_SID)
        .verifications.create({ to: phone, channel: "sms" })
        .then((verification) => {
            //console.log(verification);
            return verification;
        });
};

module.exports.getPhoneVerificationCheck = function (phone, code) {
    return client.verify
        .services(process.env.TWILIO_VERIFY_SID)
        .verificationChecks.create({ to: phone, code: code })
        .then((verification) => {
            //console.log(verification);
            return verification;
        });
};
module.exports.sendSMS = function (phone, message) {
    const bindingOpts = {
        identity: "00000001", // We recommend using a GUID or other anonymized identifier for Identity.
        bindingType: "sms",
        address: phone
    };

    return client.notify
        .services(process.env.TWILIO_NOTIFY_SID)
        .bindings.create(bindingOpts)
        .then((binding) => {
            return binding.sid;
        })
        .catch((error) => console.log(error))
        .done();
};
