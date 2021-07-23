import GoogleChrome from "./svg/GoogleChrome.svg";
import GoogleChromeOutlined from "./svg/GoogleChromeOutlined.svg";

import LoadingDots from "./svg/LoadingDots.svg";
import NewBadge from "./svg/NewBadge.svg";
import Remote from "./svg/Remote.svg";
import Ticket from "./svg/Ticket.svg";
import Scener from "./svg/Scener";
import TV from "./svg/TV.svg";
import PushPin from "./svg/PushPin.svg";
import TikTok from "./svg/TikTok.svg";
import Headset from "./svg/Headset";
import Verified from "./svg/Verified";
import PushPinIcon from "./svg/PushPin";
import MailIcon from "./svg/MailIcon";

import AudienceIcon from "./svg/Buildanaudience.svg";
import TheaterIcon from "./svg/Watchpartytheater.svg";
import RoomIcon from "./svg/Watchpartyroom.svg";
import ShareIcon from "./svg/sharelink.svg";

const SQUARE_ICONS = ["Remote", "Scener", "TV", "PushPin", "GoogleChrome", "GoogleChromeOutlined", "TikTok", "ShareIcon"];

let icons = {
    GoogleChrome,
    GoogleChromeOutlined,
    LoadingDots,
    NewBadge,
    Remote,
    Ticket,
    Scener,
    TV,
    PushPin,
    TikTok,
    ShareIcon
};

for (let i in icons) {
    icons[i].defaultProps = {
        height: SQUARE_ICONS.indexOf(i) !== -1 ? "1em" : null,
        width: SQUARE_ICONS.indexOf(i) !== -1 ? "1em" : null,
        fill: "currentColor"
    };
}

export {
    GoogleChrome,
    GoogleChromeOutlined,
    LoadingDots,
    NewBadge,
    Ticket,
    Remote,
    Scener,
    TV,
    PushPin,
    PushPinIcon,
    TikTok,
    Headset,
    Verified,
    MailIcon,
    AudienceIcon,
    TheaterIcon,
    RoomIcon,
    ShareIcon
};
