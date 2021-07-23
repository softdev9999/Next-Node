import React, { useState, useEffect, useRef } from "react";

import { Grid, Typography, Button, makeStyles, Divider, Link, Toolbar, IconButton, TextField } from "@material-ui/core";
import SplitCard from "../SplitCard/SplitCard";
import PostInstallStars from "../SplitCard/svg/PostInstall_Stars.svg";
import ButtonWithFeedback from "../ButtonWithFeedback/ButtonWithFeedback";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { ToggleButton } from "@material-ui/lab";
import { useRouter } from "next/router";
import AddEvent from "../Event/AddEvent";
import LinkIcon from "@material-ui/icons/Link";
import useAPI from "utils/useAPI";
import { createRoom } from "utils/API";
import config from "../../config";
import { useApp } from "hooks/Global/GlobalAppState";

import CheckMarkIcon from "@material-ui/icons/CheckRounded";
import ScenerThemeDefault from "theme/ScenerThemeDefault";

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(0),
        margin: 0,
        width: "100%",
        height: "100%"
    },
    choiceButton: {
        width: "100%",
        marginBottom: "1rem",
        padding: "1.5rem",
        borderRadius: "0.5rem",
        textTransform: "inherit"
    },
    leftContainer: {
        padding: theme.spacing(3, 3, 8, 3),
        margin: 0,
        width: "100%",
        height: "100%"
    },
    rightContainer: {
        padding: theme.spacing(3, 3, 8, 3),
        margin: 0,
        width: "100%",
        height: "100%"
    },
    contentContainer: {
        padding: theme.spacing(3, 5)
    },
    actions: {
        flexDirection: "row",
        padding: "2rem",
        width: "100%"
    },
    outlinedInput: {
        background: theme.functions.rgba(theme.palette.common.black, 0.2),
        height: theme.spacing(5),
        borderRadius: 0
    },
    notchedOutline: {
        border: "none"
    },
    toggleButton: {
        color: "white",
        border: "none",
        backgroundColor: theme.functions.rgba(theme.palette.primary.dark, 0.3)
    },
    toggleButtonSelected: {
        border: "none",
        background: `linear-gradient(45deg, ${theme.palette.scener.supernova},  ${theme.palette.scener.gradientDark})`
    }
}));

class HostingNode {
    constructor(id, title, desc, optionList, parentId, actions, callback) {
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.optionList = optionList;
        this.parentId = parentId;
        this.actions = actions;
        this.callback = callback;
    }
}

const HostingCard = ({ onFinished, contentId }) => {
    const classes = useStyles();
    const router = useRouter();
    const copyRef = useRef();

    const [loading, setLoading] = useState(false);
    const [hasCopied, setHasCopied] = useState(null);
    const [shareurl, setShareurl] = useState(null);

    const [currentNode, setCurrentNode] = useState("start");
    const [currentOption, setCurrentOption] = useState(null);

    const [showPasscode, setShowPasscode] = useState(false);
    const [passcode, setPasscode] = useState(null);

    const {
        auth: { user }
    } = useApp();

    const { host } = useAPI();

    const setupRoom = (roomType, unlisted) => {
        if (roomType) {
            setLoading(true);
            host({ contentId, roomType, unlisted, passcode })
                .then(() => {
                    // this returns too soon, so don't set loading false here until fixed
                    //setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    };

    const navNode = (node, defaultSelect) => {
        if (showPasscode && passcode && !defaultSelect) {
            //router.push("/host/public/ready?passcode=" + passcode);
            setupRoom("public", true);
        } else if (node && node.charAt(0) == "/") {
            setupRoom(node.substring(1), false);
        } else {
            if (defaultSelect) {
                setCurrentOption(defaultSelect);
            } else {
                setCurrentOption(null);
            }
            setCurrentNode(node);
        }
    };

    const learnMore = () => {};

    const getRoomLink = () => {
        createRoom("private", false)
            .then((r) => {
                if (r && r.code && r.member) {
                    setShareurl(config.WEB_HOST + "/join/" + r.code);
                }
            })
            .catch((e) => console.error(e));
    };

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
                }
            }, 1500);
        }
    };

    const scheduleComponent = (
        <Grid container alignContent="flex-start" justify="center">
            <AddEvent
                cancelTitle="Back"
                onCancel={() => {
                    navNode(hostNodeList[currentNode].parentId, currentNode);
                }}
                onSave={(event) => {
                    console.log("event saved", event);
                    router.push("/" + user.username);
                }}
            />
        </Grid>
    );

    const shareComponent = (
        <Grid container alignContent="flex-start" justify="center" style={{ padding: "2rem" }}>
            <Typography variant={"h3"} align="center" paragraph>
                {shareurl ? "Copy this watch party link and share it with your friends" : "Creating link..."}
            </Typography>
            <TextField
                fullWidth
                disabled
                size="small"
                margin="dense"
                variant="outlined"
                value={shareurl}
                InputProps={{
                    classes: {
                        root: classes.outlinedInput,
                        notchedOutline: classes.notchedOutline
                    }
                }}
            />
            <Grid container alignContent="flex-end" justify="space-around" direction="column" className={classes.actions}>
                <Grid item>
                    <Button variant="outlined" color="primary" fullWidth onClick={learnMore}>
                        Watch party tips
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant={"contained"}
                        color="secondary"
                        disabled={!shareurl}
                        onClick={() => copyClipboard(copyRef.current)}
                        style={{ backgroundColor: hasCopied && ScenerThemeDefault.palette.success.main, marginBottom: "1rem" }}
                        endIcon={!hasCopied ? <LinkIcon style={{ color: "currentColor" }} /> : <CheckMarkIcon style={{ color: "currentColor" }} />}
                    >
                        {!hasCopied ? "copy link" : "copied!"}
                    </Button>
                    <textarea ref={copyRef} readOnly={true} style={{ position: "absolute", left: -9999 }} value={shareurl} />
                </Grid>
            </Grid>
        </Grid>
    );

    const passcodeComponent = (
        <Grid container alignContent="flex-start" justify="center" direction="column">
            <ToggleButton
                disableRipple
                classes={{ root: classes.toggleButton, selected: classes.toggleButtonSelected }}
                className={classes.choiceButton}
                value={1}
                selected={showPasscode}
                onChange={() => {
                    setCurrentOption(null);
                    setShowPasscode(true);
                }}
            >
                <Grid container alignItems="flex-start" justify="center" direction="column">
                    <Grid item>
                        <Typography variant="h3" align="left" style={{ marginBottom: "0.5rem" }}>
                            Host a private theater now
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h5" align="left">
                            Choose a passcode{showPasscode ? "" : " that lets people join your watch party"}
                        </Typography>
                    </Grid>
                    {showPasscode && (
                        <Grid item container>
                            <TextField
                                value={passcode}
                                onChange={({ currentTarget: { value } }) => {
                                    setPasscode(value);
                                }}
                                InputProps={{
                                    classes: {
                                        root: classes.outlinedInput,
                                        notchedOutline: classes.notchedOutline
                                    }
                                }}
                                color="secondary"
                                autoFocus={true}
                                variant="outlined"
                                margin={"normal"}
                                fullWidth
                            />
                        </Grid>
                    )}
                </Grid>
            </ToggleButton>
        </Grid>
    );

    const hostNodeList = {
        start: new HostingNode(
            "start",
            "Host a watch party",
            "",
            [
                { title: "Room", desc: "Invite-only for up to 10 friends. Everyone can turn on their camera", route: "private" },
                {
                    title: "Theater",
                    desc: "Host a Public or Private watch party for unlimited guests. Invite co-hosts to join you on camera or mic",
                    route: "public"
                }
            ],
            null,
            true
        ),

        private: new HostingNode(
            "private",
            "Watch party room",
            "",
            [
                { title: "Host a room now", desc: "", route: "/private" },
                { title: "Create link now, but share and watch later", desc: "Want to watch later?", route: "private-share" }
            ],
            "start",
            true
        ),

        "private-share": new HostingNode(
            "private-share",
            "Watch party with friends",
            "",
            [{ component: shareComponent }],
            "private",
            false,
            getRoomLink
        ),

        "private-later": new HostingNode(
            "private-later",
            "Schedule a watch party for later",
            "",
            [{ component: scheduleComponent }],
            "private",
            false
        ),

        public: new HostingNode(
            "public",
            "Watch party theater",
            "",
            [
                { title: "Public theater", desc: "Anyone can join your party", route: "public-public" },
                { title: "Private theater", desc: "Users will need a passcode to join your watch party", route: "public-code" }
            ],
            "start",
            true
        ),

        "public-public": new HostingNode(
            "public-public",
            "Public theater",
            "",
            [
                { title: "Host a public theater now", desc: "", route: "/public" },
                { title: "Schedule for later", desc: "", route: "public-later" }
            ],
            "public",
            true
        ),

        "public-code": new HostingNode(
            "public-code",
            "Public theater",
            "",
            [{ component: passcodeComponent }, { title: "Schedule for later", desc: "", route: "public-later" }],
            "public",
            true
        ),

        "public-later": new HostingNode("private-later", "Schedule a watch party for later", "", [{ component: scheduleComponent }], "public", false)
    };

    const rightContent = (
        <Grid container spacing={0} alignContent="center" justify="center" className={classes.rightContainer}>
            {currentNode &&
                hostNodeList[currentNode] &&
                hostNodeList[currentNode].optionList.map((o) => (
                    <>
                        {o.component && o.component}
                        {o.route && (
                            <Grid key={o.route} item xs={12}>
                                <ToggleButton
                                    classes={{ root: classes.toggleButton, selected: classes.toggleButtonSelected }}
                                    className={classes.choiceButton}
                                    value={o.route}
                                    selected={currentOption == o.route}
                                    onChange={() => {
                                        setShowPasscode(null);
                                        setCurrentOption(o.route);
                                    }}
                                >
                                    <Grid container alignItems="flex-start" justify="center" direction="column">
                                        <Grid item>
                                            <Typography variant="h3" align="left" style={{ marginBottom: "0.5rem" }}>
                                                {o.title}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h5" align="left">
                                                {o.desc}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </ToggleButton>
                            </Grid>
                        )}
                    </>
                ))}

            <Grid container alignContent="flex-end" justify="space-around" direction="column" className={classes.actions}>
                {currentNode && hostNodeList[currentNode] && hostNodeList[currentNode].parentId && hostNodeList[currentNode].actions && (
                    <Grid item xs={12} sm={8} md={5}>
                        <Button
                            variant="outlined"
                            color="primary"
                            fullWidth
                            onClick={() => {
                                navNode(hostNodeList[currentNode].parentId, currentNode);
                            }}
                        >
                            Back
                        </Button>
                    </Grid>
                )}

                {currentNode && hostNodeList[currentNode] && hostNodeList[currentNode].optionList && hostNodeList[currentNode].actions && (
                    <Grid item xs={12} sm={8} md={5}>
                        <ButtonWithFeedback
                            status={loading ? "loading" : ""}
                            variant="contained"
                            color="secondary"
                            fullWidth
                            onClick={() => {
                                if (hostNodeList[currentOption].callback) {
                                    hostNodeList[currentOption].callback();
                                }
                                navNode(currentOption);
                            }}
                            disabled={!currentOption && !passcode}
                        >
                            {(!currentOption && !passcode) || hostNodeList[currentOption] ? "Next" : "Finish"}
                        </ButtonWithFeedback>
                    </Grid>
                )}
            </Grid>
        </Grid>
    );

    const background = (
        <div
            style={{
                backgroundImage: `url(/images/cards/PostInstall.jpg)`,
                backgroundPosition: "center center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                width: "100%",
                height: "100%"
            }}
        />
    );

    const foreground = (
        <PostInstallStars style={{ position: "absolute", left: 0, top: 0, transform: "translate(-10%,-30%) scale(1)", width: "110%" }} />
    );

    const leftContent = (
        <Grid container alignContent="center" alignItems="center" justify="space-around" direction="column" className={classes.leftContainer}>
            {currentNode && hostNodeList[currentNode] && hostNodeList[currentNode].title ? (
                <Grid item>
                    <Typography variant="h2" align="center" style={{ fontSize: "3rem" }}>
                        {hostNodeList[currentNode].title}
                    </Typography>
                </Grid>
            ) : null}
            {currentNode && hostNodeList[currentNode] && hostNodeList[currentNode].desc ? (
                <Grid item>
                    <Typography align="center">{hostNodeList[currentNode].desc}</Typography>
                </Grid>
            ) : null}
            <Grid item>
                <Button variant="contained" color="primary" fullWidth onClick={learnMore}>
                    Learn More
                </Button>
            </Grid>
        </Grid>
    );

    return (
        <SplitCard
            foreground={foreground}
            leftContent={leftContent}
            rightContent={rightContent}
            background={background}
            showHomeButton={false}
            leftWidth={5}
            rightWidth={7}
        />
    );
};

export default HostingCard;
