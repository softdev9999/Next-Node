import classname from "classnames";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Link from "next/link";
import { Grid, Typography, TextField, CircularProgress } from "@material-ui/core";
import { useExtension } from "hooks/Extension/Extension";

import { useApp } from "hooks/Global/GlobalAppState";

import config from "../../config";
import { getRoom, getContentById } from "utils/API";
import { isChrome, isMobile } from "utils/Browser";
import { useRouter } from "next/router";
import SplitCard from "components/SplitCard/SplitCard";

import PostInstallStars from "../SplitCard/svg/PostInstall_Stars.svg";
import useAPI from "utils/useAPI";
import ButtonWithFeedback from "../ButtonWithFeedback/ButtonWithFeedback";

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

const LoadingCard = () => {
    const classes = useStyles();
    const theme = useTheme();

    const leftContent = (
        <Grid container spacing={2} direction="column" wrap="nowrap" className={classes.contentContainer} alignItems={"center"} justify="center">
            <CircularProgress size={"10vh"} color="inherit" />
        </Grid>
    );

    const background = (
        <div
            style={{
                backgroundImage: theme.gradients.dark,
                backgroundPosition: "center center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                width: "100%",
                height: "100%"
            }}
        />
    );

    const foreground = <PostInstallStars style={{ position: "absolute", left: 0, top: 0, transform: "translate(-12.8%, 20%)", width: "110%" }} />;

    return <SplitCard foreground={foreground} leftContent={leftContent} rightContent={null} background={background} leftWidth={12} />;
};

export default LoadingCard;
