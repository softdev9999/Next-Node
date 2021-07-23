
function convertBase(value, from_range, to_range) {
    let from_base = from_range.length;
    let to_base = to_range.length;
    //console.log({ value, from_range, to_range, to_base, from_base });

    let dec_value = (value + "")
        .split("")
        .reverse()
        .reduce(function (carry, digit, index) {
            if (from_range.indexOf(digit) === -1) throw new Error("Invalid digit `" + digit + "` for base " + from_base + ".");
            //console.log(carry, digit, index, from_range.indexOf(digit), Math.pow(from_base, index));
            return (carry += from_range.indexOf(digit) * Math.pow(from_base, index));
        }, 0);

    let new_value = "";
    while (dec_value > 0) {
        //console.log({ dec_value, new_value, mod: to_range[dec_value % to_base] });
        new_value = to_range[dec_value % to_base] + new_value;
        //console.log(dec_value % to_base, " ", dec_value - (dec_value % to_base));
        dec_value = Math.floor((dec_value - (dec_value % to_base)) / to_base);
    }
    return new_value || "0";
}
function md5(data, raw = false) {
    const crypto = require("crypto");

    if (raw) {
        return crypto.createHash("md5").update(data);
    }
    return crypto.createHash("md5").update(data).digest("hex");
}

module.exports.convertBase = convertBase;
module.exports.md5 = md5;
