#!/usr/bin/env node
const process = require("process");
const fs = require("fs");
const path = require("path");
const versionbump = () => {
    const envManifest = require(path.resolve(__dirname, "../package.json"));
    let vNumber = envManifest.version;
    let vComps = vNumber.split(".");

    vComps[vComps.length - 1] = parseInt(vComps[vComps.length - 1], 10) + 1;

    let newVersion = vComps.join(".");

    envManifest.version = newVersion;
    fs.writeFileSync(path.resolve(__dirname, "../package.json"), JSON.stringify(envManifest, null, 4));

    process.stdout.write(newVersion);
    return newVersion;
};

versionbump();
