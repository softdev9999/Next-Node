#!/usr/bin/env node
const process = require("process");
const path = require("path");
const versionbump = () => {
    const envManifest = require(path.resolve(__dirname, "../package.json"));
    let vNumber = envManifest.version;

    process.stdout.write(vNumber);
    return vNumber;
};

versionbump();
