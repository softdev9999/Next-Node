import React, { useState, useEffect } from "react";
import { useApp } from "hooks/Global/GlobalAppState";
import { useExtension } from "hooks/Extension/Extension";
import { getServiceNameFromUrl } from "utils/Browser";

import { makeStyles, Grid, Typography, Button } from "@material-ui/core";
import MomentUtils from "@date-io/moment"; // choose your lib
import moment from "moment";
import { mutate } from "swr";

import { createEvent, createRoom } from "utils/API";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import SelectTextField from "./SelectTextField";
import TextField from "./TextField";
import TimePicker from "./TimePicker";
import DatePicker from "./DatePicker";
import ButtonWithFeedback from "../ButtonWithFeedback/ButtonWithFeedback";

const AddEvent = ({
    onDismiss,
    onSave,
    onCancel,
    url,
    content,
    hideTitle,
    hideBack,
    withCode,
    withRoom = true,
    cancelTitle = "Cancel",
    isHostEvent
}) => {
    const classes = useStyles();
    const {
        auth: { userId }
    } = useApp();

    const [loading, setLoading] = useState(false);

    const [website, setWebsite] = useState("");
    const [passcode, setPasscode] = useState(withCode);
    const [eventName, setEventName] = useState("");

    const [passcodeError, setPasscodeError] = useState(null);
    const [websiteError, setWebsiteError] = useState(null);
    const [serviceChoice, setServiceChoice] = useState("");
    const [eventNameError, setEventNameError] = useState(null);

    const [dateError, setDateError] = useState(null);
    const [selectedDate, handleDateChange] = useState(new moment());

    const { supportedServices } = useExtension();

    useEffect(() => {
        clearErrors();
        return () => {
            clearForm();
        };
    }, []);

    useEffect(() => {
        if (content) {
            setServiceChoice(content.service);
            setEventName(content.title + (content.subtitle ? " " + content.subtitle : ""));
        }
    }, [content]);

    useEffect(() => {
        if (withCode) {
            setPasscode(withCode);
        }
    }, [withCode]);

    useEffect(() => {
        if (url) {
            // if a URL is specified, find and set the corresponding service
            let serv = getServiceNameFromUrl(url);

            if (serv) {
                setServiceChoice(serv);
            }
        }
    }, [url]);

    const validate = () => {
        let valid = true;
        clearErrors();

        if (!eventName) {
            setEventNameError("Event Name is required");
            valid = false;
        }

        if (website && !website.match(/^(?:https?:\/\/)?(?:[\w-])+\.[\w-]{2,6}/i)) {
            setWebsiteError("Invalid website");
            valid = false;
        }

        return valid;
    };

    const saveEvent = (roomId) => {
        let dateFormatted = Math.round(selectedDate.format("x") / 1000);
        let urlFormatted = website ? (!website.startsWith("http://") && !website.startsWith("https://") ? "https://" + website : website) : null;

        let eventData = {
            title: eventName,
            startTime: dateFormatted,
            url: urlFormatted,
            service: serviceChoice,
            roomId: roomId
        };

        return createEvent(eventData)
            .then((res_) => {
                mutate(
                    "/users/" + userId + "/events",
                    (events) => {
                        return events ? [...events, res_] : [res_];
                    },
                    false
                );
                setLoading(false);
                onSave && onSave(res_);
                onDismiss && onDismiss(res_);
            })
            .catch(() => {
                setLoading(false);
                onDismiss && onDismiss(false);
                return false;
            });
    };

    const setupEventRoom = () => {
        if (validate()) {
            setLoading(true);

            if (withRoom || passcode) {
                return createRoom("public", !!passcode, passcode)
                    .then((r) => {
                        if (r && r.id && r.member) {
                            return saveEvent(r.id);
                        }
                    })
                    .catch((e) => console.error(e));
            } else {
                return saveEvent();
            }
        }
    };

    const onServiceChoice = (event) => {
        setServiceChoice(event.target.value);
    };

    const clearForm = () => {
        clearErrors();
        setLoading(false);
        setWebsite("");
        setEventName("");
    };

    const clearErrors = () => {
        setWebsiteError(false);
        setDateError(false);
        setEventNameError(false);
    };

    return (
        <Grid container item spacing={3} xs={12} className={classes.eventForm}>
            {!hideTitle && (
                <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom className={classes.eventTitle}>
                        Schedule a watch party
                    </Typography>
                </Grid>
            )}
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <Grid item xs={12} sm={12} md={6}>
                    <DatePicker isTransparent={isHostEvent} error={dateError} selectedValue={selectedDate} onChange={handleDateChange} />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                    <TimePicker isTransparent={isHostEvent} error={dateError} selectedValue={selectedDate} onChange={handleDateChange} />
                </Grid>
            </MuiPickersUtilsProvider>
            <Grid item xs={12}>
                <TextField
                    label="event name"
                    placeholder="Enter a title for your event"
                    error={eventNameError}
                    value={eventName}
                    isTransparent={isHostEvent}
                    onChange={(event) => setEventName(event.target.value)}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="event website url"
                    placeholder="mywebsite.com"
                    error={websiteError}
                    required={false}
                    value={website}
                    isTransparent={isHostEvent}
                    onChange={(event) => setWebsite(event.target.value)}
                />
            </Grid>
            {withCode != null && (
                <Grid item xs={12}>
                    <TextField
                        label="theater passcode"
                        placeholder="(Optional) passcode required to join"
                        error={passcodeError}
                        required={false}
                        value={passcode}
                        isTransparent={isHostEvent}
                        onChange={(event) => setPasscode(event.target.value)}
                    />
                </Grid>
            )}
            <Grid item xs={12}>
                <SelectTextField options={supportedServices} onChange={onServiceChoice} selectedValue={serviceChoice} />
            </Grid>
            <Grid container spacing={3} justify="space-around" className={classes.actionContainer}>
                {!hideBack && (
                    <Grid item xs={12} sm={12} md={5}>
                        <Button
                            fullWidth
                            disabled={loading}
                            className={classes.button}
                            variant="outlined"
                            onClick={() => {
                                onCancel && onCancel(false);
                                onDismiss && onDismiss(false);
                            }}
                        >
                            {cancelTitle}
                        </Button>
                    </Grid>
                )}
                <Grid item xs={12} sm={12} md={hideBack ? 12 : 7} alignItems="flex-end">
                    <ButtonWithFeedback
                        fullWidth
                        disabled={loading}
                        status={loading ? "loading" : null}
                        className={classes.button}
                        variant="contained"
                        color="secondary"
                        onClick={setupEventRoom}
                    >
                        Add watch party to schedule
                    </ButtonWithFeedback>
                </Grid>
            </Grid>
        </Grid>
    );
};

const useStyles = makeStyles((theme) => ({
    eventForm: {
        margin: "0rem",
        padding: "1rem",
        width: "100%",
        [theme.breakpoints.down("xs")]: {
            padding: 0
        }
    },
    eventTitle: {
        fontSize: theme.spacing(2),
        fontWeight: 800,
        letterSpacing: 0.4,
        lineHeight: theme.spacing(2)
    },
    svgDownIcon: {
        height: "2.4rem",
        width: "2.5rem",
        backgroundColor: "rgba(255,255,255,0.35)",
        top: "0rem"
    },
    input: {
        paddingTop: "0.6875rem"
    },
    serviceSelect: {
        height: "2.25rem",
        width: "12.875rem",
        color: theme.palette.scener.cloud,
        paddingTop: "0.7rem"
    },
    error: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start"
    },
    actionContainer: {
        margin: "0rem",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        [theme.breakpoints.down("xs")]: {
            flexDirection: "column-reverse",
            flexWrap: "unset"
        }
    },
    button: {
        minWidth: theme.spacing(18)
    }
}));

export default AddEvent;
