import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, DialogContent, DialogActions, Button, Tooltip } from "@material-ui/core";
import { useRef } from "react";
import NavPopup from "../NavPopup/NavPopup";
const useStyles = makeStyles((theme) => ({
    container: {
        position: "relative",
        width: "auto",
        cursor: "pointer"
    },
    track: {
        borderRadius: theme.spacing(2),
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        height: "100%",
        width: "100%",
        position: "relative",
        backgroundColor: 'rgba(19,0,40,0.6)',
        boxShadow: 'inset -1px 0 3px 0 rgba(0,0,0,0.5)',
        opacity: 0.85,
        border: "solid .125rem " + theme.palette.primary.main
    },
    trackContent: {
        left: "50%",
        right: 0,
        top: 0,
        bottom: 0,
        position: "absolute",
        width: "50%",
        zIndex: 1
    },
    thumb: {
        borderRadius: theme.spacing(2),
        width: "calc(50% - 0.2rem)",
        right: 3,
        left: "50%",
        top: 2,
        bottom: 2,
        position: "absolute",
        background: theme.palette.secondary.main,
        transition: theme.transitions.create(),
        zIndex: 2,
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "center",
        letterSpacing: ".1em",
        fontWeight: "700",
        color: "#AAA",
        fontSize: theme.spacing(2)
    },
    thumbOn: {
        borderRadius: theme.spacing(2),
        width: "calc(50% - 0.3rem)",
        right: "50%",
        left: 3,
        top: 2,
        bottom: 2,
        position: "absolute",
        background: "#F00",
        transition: theme.transitions.create(),
        zIndex: 2,
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        letterSpacing: ".1em",
        fontWeight: 700,
        fontSize: theme.spacing(2)
    },
    backButtonRoot: {
        backgroundColor: "red",
        "&:hover": {
            backgroundColor: "#CC0000"
        }
    },
    backButtonLabel: {
        color: "white"
    }
}));

const LiveToggle = ({ checked, onChange, children, ...others }) => {
    const classes = useStyles();
    const [showWarning, setShowWarning] = useState(false);
    const toggleRef = useRef();
    const toggleLive = () => {
        if (!checked) {
            onChange(true);
        } else {
            setShowWarning(true);
        }
    };

    return (
        <>
            <div className={classes.container} {...others} ref={toggleRef}>
                <Tooltip title={checked ? "end watch party" : "go live"}>
                    <div className={classes.track} onClick={toggleLive}>
                        <div className={checked ? classes.thumbOn : classes.thumb}>LIVE</div>
                        {children && <div className={classes.trackContent}>{children}</div>}
                    </div>
                </Tooltip>
            </div>
            <NavPopup open={showWarning} onDismiss={() => setShowWarning(false)} anchorEl={toggleRef.current}>
                <>
                    <DialogContent style={{ padding: "2rem 5rem .5rem", maxWidth: "25rem", marginLeft: "auto", marginRight: "auto" }}>
                        <Typography align="center" variant="h6">
                            Are you sure? This will end this party for everyone.
                        </Typography>
                    </DialogContent>
                    <DialogActions style={{ padding: ".5rem 3rem 2rem", maxWidth: "25rem", marginLeft: "auto", marginRight: "auto" }}>
                        <Button onClick={() => setShowWarning(false)} variant="contained" color="secondary">
                            CANCEL
                        </Button>
                        <Button
                            onClick={() => {
                                setShowWarning(false);
                                onChange(false);
                            }}
                            classes={{ root: classes.backButtonRoot, label: classes.backButtonLabel }}
                            variant="contained"
                            fullWidth
                        >
                            END WATCH PARTY
                        </Button>
                    </DialogActions>
                </>
            </NavPopup>
        </>
    );
};

export default LiveToggle;
