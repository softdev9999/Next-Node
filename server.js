const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");

const dev = process.env.NODE_ENV !== "production";
console.log("> dev mode?", dev);

const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
    key: fs.readFileSync("./.local/localhost.key"),
    cert: fs.readFileSync("./.local/localhost.crt")
};

app.prepare().then(() => {
    createServer(httpsOptions, (req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(3000, (err) => {
        if (err) throw err;
        console.log("> Ready on https://localhost:3000");
    });
});
