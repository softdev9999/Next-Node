import classnames from "classnames";
import { useState } from "react";
import { Typography, FormControlLabel, Checkbox, makeStyles } from "@material-ui/core";
import ButtonWithFeedback from "../ButtonWithFeedback/ButtonWithFeedback";

import CheckCircleIcon from "@material-ui/icons/CheckCircleRounded";
import CircleIcon from "@material-ui/icons/RadioButtonUncheckedOutlined";
import useAPI from "utils/useAPI";
const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        flexFlow: "row wrap",
        alignItems: "stretch",
        [theme.breakpoints.down("xs")]: {
            flexFlow: "column nowrap"
        }
    },
    sectionContainer: {
        flex: "0 0 100%",
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "stretch",
        justifyContent: "space-between",
        [theme.breakpoints.down("xs")]: {
            flexFlow: "column nowrap"
        }
    },
    header: {
        flex: "0 0 100%",
        padding: theme.spacing(1, 5, 3),
        borderBottom: "solid .125rem " + theme.palette.scener.supernova,
        marginBottom: theme.spacing(5)
    },
    section: {
        flex: "0 0 30%",
        padding: theme.spacing(5, 6),
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "stretch",
        justifyContent: "space-between",
        backgroundColor: theme.functions.rgba(theme.palette.scener.midnight, 1),
        "&:hover": {
            backgroundColor: theme.functions.rgba(theme.palette.scener.midnight, 1)
        }
    },
    sectionHovered: {
        backgroundColor: theme.palette.scener.midnight
    },
    content: {
        marginBottom: theme.spacing(4)
    },
    inner: {
        padding: theme.spacing(2, 0)
    },
    padderBottomZero: {
        paddingBottom: 0
    },
    divider: {},
    subtitle: {
        color: theme.functions.rgba(theme.palette.common.white, 0.5)
    },
    button: {},
    buttonHovered: {
        backgroundColor: "transparent",
        "&:hover": {
            backgroundColor: theme.functions.rgba(theme.palette.scener.pink, 1)
        }
    }
}));

const RoomType = ({ contentId }) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [unlisted, setUnlisted] = useState(false);
    const [hoverIndex, setHoverIndex] = useState(-1);
    const { host, schedule } = useAPI();
    const onComplete = (roomType) => {
        if (roomType) {
            console.log(contentId);
            setLoading(true);
            host({ contentId, roomType, unlisted })
                .then(() => {
                    // this returns too soon, so don't set loading false here until fixed
                    //setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    };

    const onSchedule = () => {
        console.log(contentId);

        schedule(contentId);
    };

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <Typography variant="h3" align="left" gutterBottom>
                    Host a watch party
                </Typography>
            </div>
            <div className={classes.sectionContainer}>
                <div className={classes.section} onMouseOver={() => setHoverIndex(0)} onMouseOut={() => setHoverIndex(-1)}>
                    <div className={classes.content}>
                        <Typography variant="h3" align="left" gutterBottom>
                            Private Party
                        </Typography>
                        <Typography variant="body1" align="left" paragraph>
                            Invite-only for up to 10 friends. Everyone can turn on their camera.
                        </Typography>
                    </div>
                    <div className={classnames(classes.inner, classes.padderBottomZero)}>
                        <ButtonWithFeedback
                            color="secondary"
                            loadingMessage={"Starting..."}
                            variant={"outlined"}
                            classes={{
                                root: classnames({
                                    [classes.buttonHovered]: true
                                })
                            }}
                            onClick={() => onComplete("private")}
                            status={loading && "loading"}
                            fullWidth
                            onTimeout={() => setLoading(false)}
                        >
                            Start a private party
                        </ButtonWithFeedback>
                    </div>
                </div>
                <div className={classes.section} onMouseOver={() => setHoverIndex(1)} onMouseOut={() => setHoverIndex(-1)}>
                    <div className={classes.content}>
                        <Typography variant="h3" align="left" gutterBottom>
                            Public Party
                        </Typography>
                        <Typography variant="body1" align="left" paragraph>
                            Host a watch party for up to a million guests. Invite co-hosts to join you on camera.
                        </Typography>
                        <FormControlLabel
                            control={<Checkbox color="default" checkedIcon={<CheckCircleIcon />} icon={<CircleIcon />} />}
                            value={unlisted}
                            onChange={({ currentTarget: { checked } }) => setUnlisted(checked)}
                            label={
                                <Typography variant="subtitle1" className={classes.subtitle}>
                                    Unlisted (won{"'"}t be featured)
                                </Typography>
                            }
                        />
                    </div>
                    <div className={classnames(classes.inner, classes.padderBottomZero)}>
                        <ButtonWithFeedback
                            color="secondary"
                            loadingMessage={"Starting..."}
                            variant={"outlined"}
                            onClick={() => onComplete("public")}
                            status={loading && "loading"}
                            fullWidth
                            classes={{
                                root: classnames({
                                    [classes.buttonHovered]: true
                                })
                            }}
                            onTimeout={() => setLoading(false)}
                        >
                            Start a live public party
                        </ButtonWithFeedback>
                    </div>
                </div>

                <div className={classes.section} onMouseOver={() => setHoverIndex(2)} onMouseOut={() => setHoverIndex(-1)}>
                    <div className={classes.content}>
                        <Typography variant="h3" align="left" gutterBottom>
                            Schedule for later
                        </Typography>
                        <Typography variant="body1" align="left">
                            Not ready now? Set up an event to let your followers know when you are going live.
                        </Typography>
                    </div>
                    <div className={classnames(classes.inner, classes.padderBottomZero)}>
                        <ButtonWithFeedback
                            color="secondary"
                            variant={"outlined"}
                            onClick={() => onSchedule()}
                            fullWidth
                            classes={{
                                root: classnames({
                                    [classes.buttonHovered]: true
                                })
                            }}
                            onTimeout={() => setLoading(false)}
                        >
                            Schedule a future watch party
                        </ButtonWithFeedback>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomType;
