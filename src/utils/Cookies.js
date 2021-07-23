import config from "../config";
import Cookies from "js-cookie";

const set = (name, data, expires = 365) => {
    if (data !== null) {
        if (typeof data !== "string") {
            data = JSON.stringify(data);
        }
        console.log("SET COOKIE for ", name, data);
        Cookies.set(name, data, { path: "", domain: config.DOMAIN, expires });
        console.log(Cookies.get());
    } else {
        console.log("REMOVE COOKIE for ", name);

        Cookies.remove(name, { path: "", domain: config.DOMAIN });
    }
};

const get = (name) => {
    let data = Cookies.get(name);
    if (data && typeof data === "string") {
        try {
            data = JSON.parse(data);
        } catch (e) {
            //console.log(e);
        }
    }
    return data;
};
export default { get, set };
