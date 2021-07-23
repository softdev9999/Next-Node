const { createRoomCode, checkRoomCode } = require("./room");

const start = parseInt(process.argv[2], 10);
const good = true;
let i = start;
const bad = [];
while (i < start + 150000) {
    i++;
    let c = createRoomCode(i);
    let rid = checkRoomCode(c);
    if (!rid || rid != i) {
        bad.push([i, c]);
    }
}
console.log(good);
console.log(bad);
