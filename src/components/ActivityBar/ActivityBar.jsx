import { makeStyles } from "@material-ui/core/styles";
import { Grid /*, TextField, InputAdornment*/ } from "@material-ui/core";
import Copyright from "../Copyright/Copyright";
//import SearchIcon from "@material-ui/icons/Search";

import LiveNow from "./LiveNow";
import RecommendedUsers from "./RecommendedUsers";
import RecentRooms from "./RecentRooms";
import PopularContent from "./PopularContent";
import UpcomingEvents from "./UpcomingEvents";
import { useMemo } from "react";
import { isMobile } from "utils/Browser";

const useStyles = makeStyles((theme) => ({
    activityDrawerContent: {},
    footer: {
        position: "relative",
        bottom: 0,
        backgroundColor: "transparent",
        width: "100%",
        [theme.breakpoints.down("xs")]: {
            width: "100vw"
        }
    }
}));

const ActivityBar = ({ sections = ["live", "recent", "upcoming", "popular", "recommended"], service }) => {
    const classes = useStyles();
    const mobile = useMemo(() => isMobile(), []);
    const sectionComponents = useMemo(
        () =>
            mobile
                ? {
                      live: <LiveNow service={service} />,
                      upcoming: <UpcomingEvents service={service} />,
                      recommended: <RecommendedUsers />,
                      popular: <PopularContent service={service} />
                  }
                : {
                      live: <LiveNow service={service} />,
                      upcoming: <UpcomingEvents service={service} />,
                      recent: <RecentRooms />,
                      recommended: <RecommendedUsers />,
                      popular: <PopularContent service={service} />
                  },
        [service, mobile]
    );

    return (
        <Grid container spacing={0} wrap={"wrap"} alignContent="stretch">
            {sections.map((s) => (sectionComponents[s] ? React.cloneElement(sectionComponents[s], { key: s, embedded: !!service }) : null))}

            <Grid className={classes.footer} item>
                {service && <hr style={{ opacity: "0.5" }} />}
                <Copyright embedded={!!service} />
            </Grid>
        </Grid>
    );
};

export default ActivityBar;
