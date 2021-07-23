import classname from "classnames";
import React, { useState, useRef } from "react";
import { withStyles, Typography, Button } from "@material-ui/core";
import LinkIcon from "@material-ui/icons/Link";
import CheckMarkIcon from "@material-ui/icons/CheckRounded";
import { useApp } from "hooks/Global/GlobalAppState";

import ScenerThemeDefault from "theme/ScenerThemeDefault";
import { useCurrentRoom } from "hooks/Room/Room";
import config from "../../../config";

const ShareView = ({ onCopied, classes, rounded, isChatView, className }) => {
    const {
        room: { code, type: roomType, owner, password: passcode },
        liveStatus
    } = useCurrentRoom();
    const copyRef = useRef();
    const {
        auth: { userId }
    } = useApp();
    const liveNotReady = !liveStatus && roomType == "public" && owner.id == userId;

    const [hasCopied, setHasCopied] = useState(null);
    const inviteLink = roomType == "public" ? config.WEB_HOST + "/" + owner.username : config.WEB_HOST + "/join/" + code;
    const copyClipboard = (el) => {
        if (process.browser) {
            ga("Copied Invite Link");

            el.focus();
            el.select();
            document.execCommand("copy");
            setHasCopied(true);
            setTimeout(function () {
                if (el) {
                    setHasCopied(false);
                    onCopied && onCopied(true);
                }
            }, 1500);
        }
    };

    return (
        <div className={classname(classes.shareContainer, className)} style={rounded ? {} : { borderRadius: 0 }}>
            <div>
                <Typography variant={"body1"} align="center" paragraph className={classes.paragraph}>
                    {"Invite " + (roomType == "public" ? "people" : "friends") + " to this watch party"}
                </Typography>
            </div>
            <Button
                variant={"contained"}
                color="secondary"
                classes={{
                    root: classname(classes.button, {
                        [classes.buttonSpacer]: isChatView
                    }),
                    label: classes.buttonLabel
                }}
                onClick={() => copyClipboard(copyRef.current)}
                style={{ backgroundColor: hasCopied && ScenerThemeDefault.palette.success.main, marginBottom: "1rem" }}
                endIcon={!hasCopied ? <LinkIcon style={{ color: "currentColor" }} /> : <CheckMarkIcon style={{ color: "currentColor" }} />}
            >
                {!hasCopied ? "copy invite link" : "copied!"}
            </Button>
            <div
                className={classname({
                    [classes.errorContainer]: liveNotReady,
                    [classes.errorMinContainer]: isChatView
                })}
            >
                <Typography
                    className={liveNotReady ? classes.errorBubble : null}
                    variant={liveNotReady ? "body2" : "body1"}
                    color={"textPrimary"}
                    align="center"
                >
                    {liveNotReady
                        ? "Notice: Viewers will not be able to join your watch party until you switch the LIVE toggle ON"
                        : roomType != "public"
                        ? "or share theater code:"
                        : "or share live theater url:"}
                </Typography>
            </div>
            {!liveNotReady && (
                <div>
                    <Typography variant={"body2"} align="center">
                        {roomType == "public" ? inviteLink : code}
                    </Typography>
                </div>
            )}
            {passcode && <Typography variant="body1" align="center" className={classes.passcode}>
                passcode: <Typography variant="h3" style={{fontWeight: "bold"}}>{passcode}</Typography>
            </Typography>}

            <textarea ref={copyRef} readOnly={true} style={{ position: "absolute", left: -9999 }} value={inviteLink} />
        </div>
    );
};

const styles = (theme) => ({
    shareContainer: {
        width: "100%",
        flexDirection: "column",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        borderRadius: theme.functions.rems(4)
    },
    errorContainer: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        width: "100%",
        paddingLeft: theme.spacing(6),
        paddingRight: theme.spacing(6),
        minHeight: 76,
        backgroundColor: theme.functions.rgba(theme.palette.common.white, 0.1)
    },
    errorMinContainer: {
        background: "transparent",
        minHeight: "auto"
    },
    secondaryText: {
        fontSize: theme.spacing(2),
        letterSpacing: 0.43,
        lineHeight: theme.spacing(3),
        textAlign: "center",
        fontWeight: 600
    },
    paragraph: {
        marginBottom: theme.spacing(1.8)
    },
    button: {
        color: theme.palette.common.white,
        width: theme.spacing(35),
        marginBottom: theme.spacing(3.5),
        boxShadow: "none",
        height: theme.spacing(4.3),
        "&:hover,&:focus,&:active": {
            boxShadow: "none"
        }
    },
    buttonLabel: {
        fontSize: theme.functions.rems(16),
        fontWeight: 800,
        letterSpacing: 0.4,
        lineHeight: theme.functions.rems(16),
        textAlign: "center"
    },
    buttonSpacer: {
        marginBottom: theme.spacing(2)
    },
    passcode: {
      marginTop: "1rem",
      width: "100%"
    }

});

export default withStyles(styles)(ShareView);
