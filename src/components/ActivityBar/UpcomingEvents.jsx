import ActivityBarSection from "./ActivityBarSection";
import useSWR from "swr";
import { Grid, CircularProgress } from "@material-ui/core";
import UpcomingEvent from "./UpcomingEvent";

const UpcomingEvents = ({ service }) => {
    const { data: upcomingEvents, error } = useSWR(
        () => {
            return "/events?" + (service ? "service=" + service : "");
        },
        { refreshInterval: 60000 }
    );
    if (upcomingEvents && upcomingEvents.items.length) {
        return (
            <ActivityBarSection title="Upcoming events">
                <Grid container spacing={0} style={service ? null : { padding: "1rem" }}>
                    {upcomingEvents.items.length > 0 &&
                        upcomingEvents.items.slice(0, 10).map((event) => <UpcomingEvent key={event.id} event={event} />)}
                </Grid>
            </ActivityBarSection>
        );
    } else if (error) {
        return <></>;
    } else if (!upcomingEvents) {
        return (
            <Grid container justify="center">
                <Grid item>
                    <CircularProgress size="5rem" />
                </Grid>
            </Grid>
        );
    } else {
        return <></>;
    }
};

export default UpcomingEvents;
