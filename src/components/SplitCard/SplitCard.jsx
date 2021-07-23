import classnames from "classnames";
import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Box, Button, Grid, Hidden, useMediaQuery } from "@material-ui/core";
import FixedRatioBox from "../FixedRatioBox/FixedRatioBox";
import NavLink from "../NavLink/NavLink";
import HelpIcon from '@material-ui/icons/Help';

const useStyles = makeStyles((theme) => ({
    usernameContainer: {
        borderBottom: "solid .0625rem" + theme.palette.primary.main,
        margin: theme.spacing(0.5, 1)
    },
    background: {
        position: "absolute",
        left: 0,
        right: "0%",
        top: 0,
        bottom: 0,
        zIndex: 1,
        overflow: "hidden",
        pointerEvents: "none"
    },
    foreground: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 3,
        pointerEvents: "none"
    },
    centerWrapper: {
        margin: "auto",
        height: "auto",
        width: "100%",
        display: "block",
        flex: "0 0 100%",
        [theme.breakpoints.down("xs")]: {
            margin: 0
        }
    },
    homeButtonContainer: {
        zIndex: 10,
        position: "absolute",
        top: theme.spacing(5),
        left: theme.spacing(5),
        [theme.breakpoints.down("xs")]: {
            left: "auto",
            top: theme.spacing(5),
            right: theme.spacing(5)
        }
    },
    homeButton: {
        minHeight: theme.functions.rems(28),
        minWidth: theme.functions.rems(130),
        backgroundColor: theme.functions.rgba(theme.palette.scener.midnight, 0.7),
        "&:hover,&:active,&:focus": {
            backgroundColor: theme.functions.rgba(theme.palette.scener.midnight, 0.7)
        }
    },
    learnButton: {
        padding: "0.4rem 1.5rem",
        backgroundColor: theme.functions.rgba(theme.palette.scener.supernova, 0.6),
        "&:hover,&:active,&:focus": {
            backgroundColor: theme.functions.rgba(theme.palette.scener.blackberry, 0.7)
        }
    },
    backButtonContainer: {
        zIndex: 10,
        position: "absolute",
        top: theme.spacing(5),
        left: theme.spacing(5)
    },
    backButton: {
        minHeight: theme.functions.rems(28),
        maxHeight: theme.functions.rems(28),
        minWidth: theme.functions.rems(100),
        maxWidth: theme.functions.rems(100),
        borderRadius: theme.functions.rems(14),
        backgroundColor: theme.functions.rgba('#100835', 0.7),
        '&:hover, &:active, &:focus': {
            backgroundColor: theme.functions.rgba('#100835', 0.7)
        }
    }
}));

const SplitCard = ({
    classname,
    leftContent,
    rightContent,
    bottomContent,
    background,
    foreground,
    rightProps,
    fullHeight = true,
    leftBackground,
    rightBackground,
    leftWidth = 8,
    rightWidth = 4,
    flipOnXs = false,
    showHomeButton = false,
    onBack,
    onLearn,
    backButton,
    containerProps = {}
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("xs"));
    return (
        <div className={classes.centerWrapper}>
            <FixedRatioBox xs={0} sm={0.61} style={{ margin: "auto" }}>
                <Grid
                    container
                    spacing={0}
                    alignItems="center"
                    justify="center"
                    style={{ height: fullHeight ? "100%" : "auto", position: "relative" }}
                >
                    {showHomeButton && !isXs && (
                        <Box className={classes.homeButtonContainer}>
                            <NavLink passHref href="/">
                                <Button classes={{ root: classes.homeButton }} color="primary" variant="contained">
                                    Return home
                                </Button>
                            </NavLink>
                        </Box>
                    )}
                    {onBack && !isXs && (
                        <Box className={classnames(backButton, classes.backButtonContainer)}>
                            <Button className={classes.backButton} onClick={onBack} color="primary" variant="contained">
                                Back
                            </Button>
                        </Box>
                    )}
                    <Grid
                        container
                        wrap="wrap"
                        justify="space-between"
                        spacing={0}
                        alignItems="stretch"
                        style={{ position: "relative", height: "100%", order: flipOnXs && isXs ? 1 : 0 }}
                        {...containerProps}
                    >
                        <div className={classes.background}>{background}</div>
                        <Hidden xsDown>
                            <div className={classnames(classes.foreground, classname)}>{foreground}</div>
                        </Hidden>
                        <Grid
                            item
                            xs={12}
                            sm={leftWidth}
                            md={leftWidth}
                            style={{
                                zIndex: 1,
                                // borderTopLeftRadius: "1rem",
                                // borderBottomLeftRadius: "1rem",
                                background: leftBackground || "transparent"
                            }}
                            container
                            justify="center"
                            alignItems="center"
                            spacing={0}
                        >
                            {leftContent}
                        </Grid>
                        {rightContent && (
                            <Grid
                                item
                                xs={12}
                                sm={rightWidth}
                                md={rightWidth}
                                style={{
                                    background:
                                        rightBackground || (isXs && "transparent") || theme.functions.rgba(theme.palette.scener.midnight, 0.85),
                                    zIndex: 1,
                                    order: flipOnXs && isXs ? -1 : 0
                                }}
                                container
                                justify="center"
                                alignItems="center"
                                spacing={0}
                                {...rightProps}
                            >
                                {rightContent}
                            </Grid>
                        )}
                        {bottomContent && (
                            <Grid container justify="flex-end" alignItems="flex-end" style={{ zIndex: 1 }}>
                                {bottomContent}
                            </Grid>
                        )}
                        {onLearn && (
                            <Grid container justify="flex-start" alignItems="center" style={{ position: "absolute", zIndex: 1, bottom: "1.5rem", left: "1.5rem" }}>
                                <Button
                                  startIcon={<HelpIcon />}
                                  onClick={onLearn}
                                  size="small"
                                  classes={{ root: classes.learnButton }}
                                  color="primary"
                                  variant="contained">
                                    Learn More
                                </Button>
                            </Grid>
                        )}
                        {isXs && !bottomContent && (
                            <Grid container justify="center" alignItems="center" style={{ zIndex: 1 }}>
                                <NavLink passHref href="/">
                                    <Button classes={{ root: classes.homeButton }} color="primary" variant="contained">
                                        Return home
                                    </Button>
                                </NavLink>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </FixedRatioBox>
        </div>
    );
};

export default SplitCard;
