import React, { useState, useEffect } from "react";
import { withStyles, Typography, IconButton, Button, Grid, Box } from "@material-ui/core";
import { PushPinIcon } from "../../Icon/Icon";
import { useCurrentRoom } from "hooks/Room/Room";
import StarBG from "../../SplitCard/svg/automated-chat-stars.svg";

const MessageView = ({ body, data, user, classes, isLocalUser, onClick, showPin }) => {
    const [parsedMessage, setParsedMessage] = useState("");
    const [hovering, setHovering] = useState(false);
    const { pinMessage } = useCurrentRoom();
    useEffect(() => {
        if (body && user) {
            safeParseLinks(body, user);
        }
    }, [body, user]);

    useEffect(() => {
        if (user) {
            //console.log(user);
        }
    }, [user]);


    const getIcon = () => {
        /* if (user.role == "owner") {
            return <OwnerIcon style={{ height: ".8em", fill: ScenerThemeDefault.palette.error.main, marginRight: ".125rem" }} />;
        } else if (user.role == "host") {
            return <GuestIcon style={{ height: ".8em", fill: ScenerThemeDefault.palette.text.primary, marginRight: ".125rem" }} />;
        } else if (user.moderator) {
            return <ModeratorIcon style={{ height: ".8em", fill: ScenerThemeDefault.palette.text.primary, marginRight: ".125rem" }} />;
        } else {*/
        return null;
        //}
    };

    const getName = () => {
        if (user.username) {
            return user.username;
        } else if (user.displayName) {
            return user.displayName;
        } else {
            return "loading...";
        }
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

    const safeParseLinks = (chatstring, userdata) => {
        import("sanitize-html").then(({ default: sanitizeHtml }) => {
            import("linkifyjs/html").then(({ default: linkifyHtml }) => {
                const cleaned = sanitizeHtml(chatstring, {
                    allowedTags: [],
                    allowedAttributes: {}
                });

                let linkcleaned =
                    userdata.role && userdata.role != "audience"
                        ? linkifyHtml(cleaned, {
                              defaultProtocol: "https"
                          })
                        : cleaned;

                setParsedMessage(linkcleaned);
            });
        });
    };

    return user && user.id != "system" ? (
        user && body ? (
            <div className={classes.messageContainer} onMouseOver={() => setHovering(true)} onMouseOut={() => setHovering(false)}>
                <div className={classes.message}>
                    <Typography variant="body1" color="textPrimary" style={{ flex: "0 1 100%" }}>
                        <span
                            onClick={!isLocalUser && onClick ? onClick : null}
                            className={isLocalUser ? classes.localUser : onClick ? classes.messageUserAction : classes.messageUser}
                        >
                            {getIcon()}
                            {getName()}:&nbsp;
                        </span>
                        <span
                            className={emojisOnly(body) ? classes.messageBodyEmojis : classes.messageBody}
                            dangerouslySetInnerHTML={{ __html: parsedMessage }}
                        />
                    </Typography>
                </div>
                {showPin && (
                    <IconButton size="small" className={classes.pinButton} style={{ opacity: hovering ? 1 : 0.2 }} onClick={() => pinMessage(body)}>
                        <PushPinIcon />
                    </IconButton>
                )}
            </div>
        ) : null
    ) : (
        <div className={classes.messageContainer}>
            <div onClick={onClick} className={data && data.highlighted ? classes.systemMessageHighlight : classes.systemMessage}>
              {data && data.url ?
                <Grid container alignItems="center" justify="space-between" wrap="nowrap" direction="row">
                  <Grid item style={{padding: "1rem 0rem 1rem 1rem"}}>
                    <Typography variant="body2" color="inherit">
                      <span
                          className={classes.messageUserAction}
                          dangerouslySetInnerHTML={{ __html: parsedMessage }}
                      />
                    </Typography>
                  </Grid>
                  <Grid item style={{position: "relative"}}>
                    <StarBG style={{ position: "absolute", width: "100%", height: "100%", marginLeft: "0.5rem" }} />
                    <Button style={{margin: "1.3rem 1rem 1.3rem 1rem"}} variant="contained" color="secondary">Learn More</Button>
                  </Grid>
                </Grid> :
                <Typography variant="body1" color="inherit">
                  <span
                      className={classes.messageBody}
                      dangerouslySetInnerHTML={{ __html: parsedMessage }}
                  />
                </Typography>}

            </div>
        </div>
    );
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
    systemMessageHighlight: {
        color: theme.palette.text.secondary,
        marginBottom: "1rem",
        width: "100%",
        background: theme.gradients.create("90", theme.palette.primary.dark, theme.palette.primary.darkest),
        cursor: "pointer"
    },
    message: {
        padding: 0,
        display: "flex",
        position: "relative",
        flexFlow: "row nowrap",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        marginLeft: "1rem",
        maxWidth: "calc(100% - 4rem)",
        flex: "0 1 100%"
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
        color: theme.palette.text.primary,
    },
    pinButton: {
        flex: "0 0 auto",
        padding: 0,
        transition: theme.transitions.create("opacity"),
        width: theme.functions.rems(20),
        height: theme.functions.rems(20)
    },
    localMessage: {
        padding: 0,
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        position: "relative",
        marginRight: 15
    },
    messageContainer: {
        display: "flex",
        position: "relative",
        flexFlow: "row nowrap",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: "100%"
    },
    localMessageContainer: {
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "100%",
        margin: theme.spacing(0.5, 0)
    }
});

export default withStyles(styles)(MessageView);
