const ACCOUNT_TYPE = {
    NONE: 0,
    ANONYMOUS: 1,
    AUTHED: 2,
    VERIFIED: 3
};

module.exports.verifyAuthorizationCookie = ({ req }) => {
    const nookies = require("nookies");
    let cookies = nookies.parseCookies({ req });
    let authCookie = decodeURIComponent(cookies["Auth-Token"] || cookies["auth-token"]);
    if (!authCookie) {
        authCookie = decodeURIComponent(req.headers["Auth-Token"] || req.headers["Auth-Token"]);
    }
    if (authCookie) {
        return this.verifyToken(authCookie.replace(/Bearer /, ""));
    } else {
        return null;
    }
};

module.exports.verifyToken = (token) => {
    const jwt = require("jsonwebtoken");

    return jwt.verify(token, process.env.JWT_KEY, { algorithms: [process.env.JWT_ALG], ignoreExpiration: true });
};

module.exports.createToken = (id, accountType) => {
    const jwt = require("jsonwebtoken");
    if (!id) {
        return {};
    }
    if (!accountType) {
        accountType = ACCOUNT_TYPE.ANONYMOUS;
    }
    let payload = {
        id: id,
        type: accountType
        //iat: Math.round(Date.now() / 1000)
        // exp: Math.round(Date.now() / 1000 + 90 * 24 * 60 * 60)
        //'nbf' => time()
    };
    return jwt.sign(payload, process.env.JWT_KEY, { algorithm: process.env.JWT_ALG });
};

module.exports.hashPassword = (password) => {
    const bcrypt = require("bcryptjs");
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

module.exports.checkPassword = (password, hash) => {
    const bcrypt = require("bcryptjs");
    return bcrypt.compareSync(password, hash);
};

module.exports.ACCOUNT_TYPE = ACCOUNT_TYPE;
