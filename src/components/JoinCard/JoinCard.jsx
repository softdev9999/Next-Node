import React from "react";
import { Grid, Typography, TextField, makeStyles } from "@material-ui/core";
import { getRoom } from "utils/API";
import { useRouter } from "next/router";
import { useState } from "react";
import SplitCard from "../SplitCard/SplitCard";
import PostInstallStars from "../SplitCard/svg/PostInstall_Stars.svg";
import ButtonWithFeedback from "components/ButtonWithFeedback/ButtonWithFeedback";

const useStyles = makeStyles((theme) => ({
    usernameContainer: {
        borderBottom: "solid .0625rem" + theme.palette.primary.main,
        marginRight: theme.spacing(1)
    },
    background: {
        backgroundImage: `url(/images/cards/PostInstall.png)`,
        backgroundPosition: "center center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100%"
    },
    backgroundOverlay: {
        position: "absolute",
        background: "rgba(0,0,0,0.2)",
        height: "100%",
        width: "100%",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1
    },
    button: {
        minWidth: theme.functions.rems(160),
        minHeight: theme.functions.rems(40),
        borderRadius: theme.functions.rems(18),
        boxShadow: "4px 4px 10px 0 rgba(0,0,0,0.18)"
    },
    outlinedButton: {
        border: "none",
        "&:hover,&:focus,&:active": {
            border: "none"
        },
        "&::after": {
            content: "''",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 0,
            opacity: 0.7,
            borderRadius: theme.spacing(6),
            background: `linear-gradient(45deg, ${theme.palette.scener.supernova},  ${theme.palette.scener.gradientLight})`
        },
        "&:before": {
            content: "''",
            background: theme.functions.rgba(theme.palette.scener.midnight, 0.9),
            backgroundClip: "padding-box",
            border: "solid 2px transparent",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 1,
            borderRadius: theme.spacing(6)
        },
        "& > .MuiTouchRipple-root-345": {
            zIndex: 5
        }
    },
    buttonLabel: {
        fontSize: theme.spacing(2),
        fontWeight: 800,
        letterSpacing: 0.4,
        zIndex: 5
    },
    contentContainer: {
        padding: "3rem",
        margin: 0,
        width: "100%",
        height: "100%",
        [theme.breakpoints.down("xs")]: {
            padding: "1rem"
        }
    },
    brandContainer: {
        flexBasis: "50%"
    },
    brandLink: {
        display: "flex",
        paddingTop: theme.spacing(7)
    },
    brandIcon: {
        height: "4rem",
        width: "auto",
        maxWidth: "100vw"
    },
    itemContainer: {
        flexBasis: "100%",
        paddingLeft: theme.spacing(7.5),
        [theme.breakpoints.down("xs")]: {
            paddingLeft: theme.spacing(0)
        }
    },
    item: {
        flexBasis: 0
    },
    primary: {
        fontFamily: "Montserrat,Roboto,sans-serif",
        fontSize: theme.functions.rems(40),
        fontWeight: 800,
        letterSpacing: 0
    },
    secondary: {
        fontSize: theme.functions.rems(18),
        letterSpacing: 0,
        lineHeight: theme.functions.rems(24)
    },
    username: {
        fontWeight: 800,
        color: theme.palette.primary.main,
        fontSize: theme.functions.rems(18),
        letterSpacing: 0,
        lineHeight: theme.functions.rems(24)
    },
    spacerTop: {
        marginTop: theme.functions.rems(28)
    }
}));

const JoinCard = () => {
    const classes = useStyles();

    const router = useRouter();

    const [error, setError] = useState(null);
    const [code, setCode] = useState("");
    const [status, setStatus] = useState(null);
    const checkCode = () => {
        if (!code) {
            setError("Invalid code.");
            return;
        }
        setError(null);
        setStatus("loading");
        getRoom(code)
            .then((d) => {
                if (d && d.id) {
                    setStatus(null);

                    if (d.username) {
                        router.push("/[username]", "/" + d.username);
                    } else {
                        router.push("/join/[roomCode]", "/join/" + code);
                    }
                } else {
                    setStatus("error");

                    setError("Invalid or expired code.");
                }
            })
            .catch((e) => {
                setStatus("error");

                e && setError(e.message);
            });
    };

    const leftContent = (
        <Grid container spacing={2} direction="column" wrap="nowrap" className={classes.contentContainer} justify="center">
            <Grid container spacing={1} direction="column" className={classes.itemContainer} justify="center">
                <Grid item xs={12} sm={10} className={classes.item}>
                    <Typography variant={"h1"}>Join the Party</Typography>
                </Grid>
                <Grid item xs={12} sm={10} className={classes.item}>
                    <Typography variant={"h4"}>You need a theater code to join.</Typography>
                </Grid>

                <Grid item xs={12} sm={6} className={classes.item}>
                    <TextField
                        value={code}
                        onChange={({ currentTarget: { value } }) => {
                            setCode(
                                value
                                    .toUpperCase()
                                    .replace(/https:\/\/.+?\/(?:join\/)?([A-Z0-9-]+?)/gi, "$1")
                                    .trim()
                            );
                            if (value.length == 0) {
                                setError(null);
                            }
                        }}
                        color="secondary"
                        error={!!error}
                        helperText={error}
                        variant="outlined"
                        margin={"normal"}
                        label="Enter Theater Code"
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        fullWidth
                        onKeyPress={({ key }) => {
                            if (key == "Enter") {
                                checkCode();
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} className={classes.item}>
                    <ButtonWithFeedback
                        disabled={!code.length}
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => checkCode()}
                        status={status}
                        loadingMessage={"joining..."}
                        onTimeout={setStatus}
                    >
                        Join
                    </ButtonWithFeedback>
                </Grid>
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

    return <SplitCard foreground={foreground} leftContent={leftContent} rightContent={null} background={background} />;
};

export default JoinCard;
