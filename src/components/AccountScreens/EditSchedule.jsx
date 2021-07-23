import React, { useState, useEffect } from "react";
import { useApp } from "hooks/Global/GlobalAppState";
import { makeStyles, Grid, Typography, Button, Divider, useMediaQuery, useTheme } from "@material-ui/core";
import EventIcon from "@material-ui/icons/Event";
import useSWR from "swr";
import moment from "moment";
import ToggleTextField from "../ToggleTextField/ToggleTextField";
import AddEvent from "../Event/AddEvent";
import { deleteEventByID } from "utils/API";

const useStyles = makeStyles((theme) => ({
    inputPlace: {
        color: "rgba(255,255,255,0.7)"
    },
    eventForm: {
        backgroundColor: "rgba(0,0,0,0.2)",
        borderRadius: "1rem",
        margin: "0rem",
        marginTop: "1rem",
        padding: "1rem",
        width: "100%"
    },
    eventTitle: {
        width: "70%"
    },
    button: {
        marginTop: theme.spacing(2.5)
    },
    eventListContainer: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        marginTop: theme.spacing(6)
    },
    eventHeaderTitle: {
        marginTop: theme.spacing(3.6),
        marginBottom: theme.spacing(2.6),
        fontSize: theme.spacing(2),
        fontWeight: 800,
        letterSpacing: 0.29,
        lineHeight: theme.functions.rems(20)
    },
    eventListItemContainer: {
        marginBottom: theme.spacing(4)
    },
    eventItemContainer: {
        marginBottom: theme.spacing(2)
    },
    eventItem: {
        display: "flex",
        alignItems: "center",
        minHeight: theme.functions.rems(56),
        padding: theme.functions.rems(10),
        backgroundColor: theme.functions.rgba(theme.palette.common.white, 0.1)
    },
    iconContainer: {
        display: "flex",
        height: "100%",
        flexDirection: "column",
        paddingLeft: theme.spacing(1.1),
        paddingRight: theme.spacing(1.6),
        paddingTop: "0.2rem"
    },
    eventIcon: {
        fontSize: theme.spacing(4)
    },
    eventPrimary: {
        fontSize: theme.functions.rems(16),
        fontWeight: 800,
        letterSpacing: 0.29,
        lineHeight: theme.functions.rems(20)
    },
    eventSecondary: {
        color: "#9987B7",
        fontSize: theme.functions.rems(14),
        fontWeight: 800,
        letterSpacing: 0.25,
        lineHeight: theme.functions.rems(20)
    },
    eventAction: {
        paddingLeft: theme.spacing(3.6),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        [theme.breakpoints.down("xs")]: {
            alignItems: "flex-end",
            marginTop: theme.spacing(2)
        }
    },
    eventButton: {
        minWidth: theme.functions.rems(134),
        [theme.breakpoints.down("xs")]: {
            maxWidth: theme.functions.rems(151)
        }
    },
    addEventContainer: {
        margin: theme.spacing(2, 0, 4),
        backgroundColor: theme.functions.rgba(theme.palette.common.white, 0.05),
        [theme.breakpoints.down("xs")]: {
            backgroundColor: "transparent"
        }
    },
    divider: {
        background: "linear-gradient(45deg, #8310fe, #6008ff)",
        height: 2
    },
    actionContainer: {
        display: "flex",
        justifyContent: "space-between",
        margin: theme.spacing(5, 0)
    },
    actionButton: {
        minWidth: theme.functions.rems(106),
        textTransform: "capitalize",
        width: "45%"
    },
    buttonLabel: {
        textTransform: "capitalize"
    }
}));
const EditSchedule = ({ onBack, content }) => {
    const classes = useStyles();
    const theme = useTheme();
    const mobileScreen = useMediaQuery(theme.breakpoints.down("xs"));
    const {
        auth: { user, update }
    } = useApp();
    const [scheduleDesc, setScheduleDesc_] = useState(user && user.schedule);
    const [scheduleDescError, setScheduleDescError_] = useState(null);
    const [addingEvent, setAddingEvent] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [fields, setField] = useState({});

    const { data: events, error: eventsError_, mutate } = useSWR(() => "/users/" + user.id + "/events");

    useEffect(() => {
        clearErrors();
        return () => {
            clearForm();
        };
    }, []);

    useEffect(() => {
        if (content) {
            console.log(content);
            setAddingEvent(true);
        }
    }, [content]);

    const formatDate = (d) => {
        //return d;
        return moment.unix(d).format("dddd, MMMM Do, h:mm A z");
    };

    const getTimeZone_ = () => {
        let time = new Date();
        let timeZoneOffset = time.getTimezoneOffset();
        let tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return moment.tz.zone(tz).abbr(timeZoneOffset);
    };

    const deleteEvent = (id) => {
        deleteEventByID(id);
        //console.log('*** EVENTS HERE ***', events.filter((ev) => ev.id != id));

        mutate(
            events.filter((ev) => ev.id != id),
            false
        );
    };

    const saveField = (field) => {
        console.log("** SAVE ***", field);

        let updates = { profile: field };
        setStatus("loading");
        return update(updates)
            .then((res) => {
                console.log(res);
                setLoading(false);

                setStatus(null);
                return true;
            })
            .catch((e) => {
                setLoading(false);
                setStatus("error");

                setError(e.message);

                return false;
            });
    };

    const clearForm = () => {
        clearErrors();
        setLoading(false);
    };

    const clearErrors = () => {
        setError(null);
    };

    return (
        <Grid container alignItems="center" justify="center" direction="column">
            <Grid item xs={12}>
                {error && (
                    <Typography variant={"body1"} align={"center"} style={{ width: "100%" }} color="error">
                        {error}
                    </Typography>
                )}
            </Grid>
            <Grid item container xs={12}>
                <Grid item xs={12}>
                    <ToggleTextField
                        multiline={true}
                        rows={3}
                        height={108}
                        showActionRight={!mobileScreen}
                        label="Schedule overview"
                        bottomLabel="HTML Tags allowed: B, I, SMALL, UL, LI"
                        placeholder="Share a little bit about the live watch parties you will be hosting."
                        error={scheduleDescError}
                        value={scheduleDesc}
                        showAction={true}
                        defaultActive={mobileScreen}
                        onSave={(value) => saveField({ schedule: value })}
                        saveOnEnter={false}
                        onChange={(value) =>
                            setField((prevState) => ({
                                ...prevState,
                                ["schedule"]: value
                            }))
                        }
                    />
                </Grid>
                {!addingEvent && (
                    <Grid item xs={12} md={8}>
                        <Button className={classes.button} variant="contained" color="secondary" fullWidth onClick={() => setAddingEvent(true)}>
                            Schedule a live watch party
                        </Button>
                    </Grid>
                )}
            </Grid>
            {!addingEvent && events && events.length > 0 && (
                <Grid container item xs={12} md={12}>
                    <div className={classes.eventListContainer}>
                        <Grid item xs={12} md={8}>
                            <Divider className={classes.divider} />
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="h4" align="left" className={classes.eventHeaderTitle}>
                                Scheduled watch parties
                            </Typography>
                        </Grid>
                    </div>
                </Grid>
            )}
            {!addingEvent && events && events.length > 0 && (
                <Grid item container xs={12} className={classes.eventListItemContainer}>
                    {events.map(
                        (item) =>
                            item.id && (
                                <Grid item key={item.id} container className={classes.eventItemContainer}>
                                    <Grid item xs={12} md={8} className={classes.eventItem}>
                                        <div className={classes.iconContainer}>
                                            <EventIcon className={classes.eventIcon} />
                                        </div>
                                        <div className={classes.eventContent}>
                                            <Typography component="h6" className={classes.eventPrimary}>
                                                {item.title}
                                            </Typography>
                                            <Typography component="h6" className={classes.eventSecondary}>
                                                {formatDate(item.startTime)}
                                            </Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={4} className={classes.eventAction}>
                                        <Button
                                            className={classes.eventButton}
                                            disabled={loading}
                                            variant="outlined"
                                            onClick={() => deleteEvent(item.id)}
                                        >
                                            Delete Event
                                        </Button>
                                    </Grid>
                                </Grid>
                            )
                    )}
                </Grid>
            )}
            {addingEvent && (
                <Grid container className={classes.addEventContainer}>
                    <AddEvent withCode="" content={content} onDismiss={() => setAddingEvent(false)} />
                </Grid>
            )}
        </Grid>
    );
};

export default EditSchedule;
