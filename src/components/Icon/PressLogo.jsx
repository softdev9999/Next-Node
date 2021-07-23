import Axios from "./svg/press/axios.svg";
import Deadline from "./svg/press/deadline.svg";
import Forbes from "./svg/press/forbes.svg";
import TechCrunch from "./svg/press/techcrunch.svg";
import TheVerge from "./svg/press/theverge.svg";
import Variety from "./svg/press/variety.svg";

let icons = {
    Axios,
    Deadline,
    Forbes,
    TechCrunch,
    TheVerge,
    Variety
};

for (let i in icons) {
    icons[i].defaultProps = {
        fill: "currentColor"
    };
}

export { Axios, Deadline, Forbes, TechCrunch, TheVerge, Variety };
