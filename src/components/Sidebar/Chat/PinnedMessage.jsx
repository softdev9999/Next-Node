import React, { useState } from "react";
import { withStyles, Typography, IconButton, Tooltip } from "@material-ui/core";
import { useEffect } from "react";
/*import GuestIcon from "@material-ui/icons/VideocamSharp";
import OwnerIcon from "@material-ui/icons/StarSharp";
import ModeratorIcon from "@material-ui/icons/SecuritySharp";*/
//import DeleteIcon from "@material-ui/icons/DeleteRounded";
import { PushPinIcon } from "../../Icon/Icon";
import { useUser } from "hooks/User/User";
import { useCurrentRoom } from "hooks/Room/Room";

const PinnedMessage = ({ classes, body, userId }) => {
    const [parsedMessage, setParsedMessage] = useState("");
    const [hovering_, setHovering] = useState(false);
    const { user } = useUser(userId, false);
    const {
        pinMessage,
        room: {
            member: { role }
        }
    } = useCurrentRoom();
    useEffect(() => {
        if (body && user) {
            safeParseLinks(body, user);
        }
    }, [body, user]);

    useEffect(() => {
        if (user) {
            console.log(user);
        }
    }, [user]);

    const unpinMessage = () => {
        pinMessage("");
    };

    const emojiRanges = [
        "\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]",
        " " // Also allow spaces
    ].join("|");

    const emojisOnly = (chatstring) => {
        let removeEmoji = chatstring.replace(new RegExp(emojiRanges, "g"), "");
        return !removeEmoji.length && chatstring.length <= 6;
    };

    const truncate_ = (str, n) => {
        return str.length > n ? str.substr(0, n - 1) + "&hellip;" : str;
    };

    const safeParseLinks = (chatstring, userdata_) => {
        import("sanitize-html").then(({ default: sanitizeHtml }) => {
            import("linkifyjs/html").then(({ default: linkifyHtml }) => {
                const cleaned = sanitizeHtml(chatstring, {
                    allowedTags: [],
                    allowedAttributes: {}
                });

                let linkcleaned = linkifyHtml(cleaned, {
                    defaultProtocol: "https"
                });

                setParsedMessage(linkcleaned);
            });
        });
    };

    return user && body ? (
        <div className={classes.messageContainer} onMouseOver={() => setHovering(true)} onMouseOut={() => setHovering(false)}>
            <div className={classes.pinnedMessage}>
                <Typography variant="body1" color="textPrimary">
                    <span className={classes.messageUser}>{user.username || user.displayName || "loading..."}:&nbsp;</span>
                    <span
                        className={emojisOnly(body) ? classes.messageBodyEmojis : classes.messageBody}
                        dangerouslySetInnerHTML={{ __html: parsedMessage }}
                    />
                </Typography>
            </div>
            <Tooltip title="un-pin message">
                <IconButton size="small" onClick={unpinMessage} className={classes.unpinButton} disabled={role != "owner"}>
                    <PushPinIcon />
                </IconButton>
            </Tooltip>
        </div>
    ) : null;
};

const styles = (theme) => ({
    name: {
        padding: theme.spacing(0.5, 2, 0)
    },
    systemMessage: {
        marginLeft: 15,
        color: theme.palette.text.secondary,
        padding: 0
    },
    pinnedMessage: {
        display: "flex",
        position: "relative",
        flexFlow: "column nowrap",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        marginLeft: "1rem",
        maxWidth: "80vw",
        flex: "0 1 100%",
        padding: theme.spacing(2, 0)
    },
    pinnedMessageTitle: {
        fontSize: ".75rem"
    },
    messageBody: {
        textOverflow: "ellipsis",
        overflow: "hidden",
        overflowWrap: "break-word",
        wordWrap: "break-word",
        wordBreak: "break-word",
        hyphens: "auto"
    },
    messageBodyEmojis: {
        fontSize: "3em",
        lineHeight: "1em"
    },
    localUser: {
        fontWeight: "bold",
        color: theme.palette.gray.main
    },
    messageUser: {
        fontWeight: "bold",
        color: theme.palette.text.secondary
    },
    messageUserAction: {
        cursor: "pointer",
        fontWeight: "bold",
        color: theme.palette.text.secondary,
        "&:hover": {
            color: theme.palette.primary.main
        }
    },
    unpinButton: {
        padding: 0,
        width: theme.functions.rems(20),
        height: theme.functions.rems(20),
        flex: "0 0 auto"
    },
    messageContainer: {
        position: "relative",
        zIndex: 100,
        flex: "0 0 auto",
        backgroundColor: theme.palette.primary.dark,
        width: "100%",
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "flex-start",
        margin: theme.spacing(0.5)
    }
});

export default withStyles(styles)(PinnedMessage);
