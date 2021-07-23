const { parsePhoneNumberFromString } = require("libphonenumber-js");

module.exports.normalizePhone = function normalizePhone(phone) {
    let numberParsed = null;

    try {
        if (phone && phone.length >= 8) {

            if ((phone.charAt(0) == "+") && (phone.length <= 11)) {
                // not enough chars to include the + in parsing (this will confuse the parser)
                phone = phone.substring(1);
            }

            numberParsed = parsePhoneNumberFromString(phone, "US");

            if (numberParsed.isPossible()) {
                return numberParsed.format("E.164");
            }
        }
    } catch (e) {
        return null;
    }

    return null;

    /*phone = phone.replace(/[^\d+]+/g, '');
  phone = phone.replace(/^00/, '+');
  if (phone.match(/^1/)) phone = '+' + phone;
  if (!phone.match(/^\+/)) phone = '+1' + phone;

  return phone;*/
};

module.exports.validatePhone = function validatePhone(phone) {
    let numberParsed = null;

    try {
        numberParsed = parsePhoneNumberFromString(phone, "US");
    } catch (e) {
        return null;
    }

    return numberParsed && numberParsed.isPossible();
};
