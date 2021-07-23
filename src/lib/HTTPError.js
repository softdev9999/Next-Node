module.exports = class HTTPError extends Error {
    constructor(message, code = 400, details = {}, name = "HTTPError") {
        super(message);
        this.name = name;
        this.code = code;
        this.details = details;
    }

    toJSON() {
        return {
            message: this.message,
            name: this.name,
            code: this.code,
            details: this.details
        };
    }
};
