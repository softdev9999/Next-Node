import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, ButtonBase } from "@material-ui/core";

import DeleteStars from "../SplitCard/svg/DeleteAccount_Stars.svg";
import { useApp } from "hooks/Global/GlobalAppState";
import SplitCard from "../SplitCard/SplitCard";

import { useState } from "react";
import { deleteUser } from "utils/API";
import ButtonWithFeedback from "../ButtonWithFeedback/ButtonWithFeedback";
import config from "../../config";

const useStyles = makeStyles((theme) => ({
    rightContainer: {
        padding: theme.spacing(6, 2),
        height: "100%",
        width: "100%",
        margin: 0,
        [theme.breakpoints.down("xs")]: {
            padding: theme.spacing(4, 4),
            width: "80%",
            background: theme.functions.rgba(theme.palette.primary.darkest, 0.85)
        }
    },
    leftContainer: {
        [theme.breakpoints.down("xs")]: {
            padding: theme.spacing(2, 8, 0)
        }
    },
    itemContainer: {
        [theme.breakpoints.down("xs")]: {
            textAlign: "center"
        }
    },
    usernameContainer: {
        borderBottom: "solid .0625rem" + theme.palette.primary.main,
        margin: theme.spacing(0.5, 1)
    },
    primaryTitle: {
        [theme.breakpoints.down("xs")]: {
            fontSize: theme.functions.rems(40),
            fontWeight: "bold",
            letterSpacing: 0,
            lineHeight: theme.functions.rems(42),
            maxWidth: theme.functions.rems(203),
            paddingLeft: theme.spacing(5)
        }
    },
    primaryText: {
        [theme.breakpoints.down("xs")]: {
            fontSize: theme.functions.rems(14),
            letterSpacing: 0,
            lineHeight: theme.functions.rems(20),
            fontWeight: 400,
            paddingLeft: theme.functions.rems(27)
        }
    },
    secondaryTitle: {
        [theme.breakpoints.down("xs")]: {
            fontSize: theme.functions.rems(18),
            letterSpacing: 0,
            fontWeight: 500,
            lineHeight: theme.functions.rems(24),
            paddingLeft: theme.spacing(5),
            paddingRight: theme.spacing(5)
        }
    },
    secondaryText: {
        flex: "0 1 100%",
        marginLeft: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            fontSize: theme.functions.rems(14),
            letterSpacing: 0,
            lineHeight: theme.functions.rems(20),
            fontWeight: 400,
            marginLeft: 0,
            paddingLeft: theme.functions.rems(8)
        }
    },
    background: {
        backgroundImage: `url(/images/cards/DeleteAccount.jpg)`,
        backgroundPosition: "center center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100%",
        [theme.breakpoints.down("xs")]: {
            backgroundImage: "url(/images/cards/DeleteAccountMobile.png)"
        }
    },
    brandIcon: {
        height: "6rem",
        [theme.breakpoints.down("xs")]: {
            width: "auto",
            height: theme.functions.rems(46)
        }
    },
    foreground: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 10,
        pointerEvents: "none"
    },
    checkboxButton: {
        flexFlow: "row nowrap",
        alignItems: "flex-start",
        justifyContent: "space-between",
        [theme.breakpoints.down("xs")]: {
            marginLeft: theme.functions.rems(6)
        }
    },
    circleIcon: {
        marginTop: theme.spacing(1)
    },
    unchecked: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: theme.functions.rems(3),
        borderRadius: "100%",
        width: theme.functions.rems(14),
        height: theme.functions.rems(14),
        position: "relative",
        backgroundColor: theme.functions.rgba(theme.palette.common.white, 0.5)
    },
    checked: {
        width: theme.functions.rems(8),
        height: theme.functions.rems(8),
        borderRadius: "100%",
        backgroundColor: theme.palette.primary.main
    },
    button: {
        [theme.breakpoints.down("xs")]: {
            minHeight: theme.functions.rems(36),
            maxWidth: theme.functions.rems(176),
            minWidth: theme.functions.rems(176)
        }
    },
    buttonLabel: {
        fontSize: theme.functions.rems(16),
        fontWeight: 800,
        letterSpacing: 0.4
    }
}));

const DeleteAccount = () => {
    const classes = useStyles();
    const {
        auth: { logout },
        popups: { deleteAccount }
    } = useApp();
    const [confirmed, setConfirmed] = useState(false);
    const [status, setStatus] = useState(null);
    const deleteAccountClicked = () => {
        if (confirmed) {
            console.log("DELETE ACCOUNT!");
            deleteUser()
                .then(() => {
                    logout();
                    setStatus("success");
                    setTimeout(() => {
                        deleteAccount.show(false);
                    }, 300);
                })
                .catch((e) => {
                    console.log(e);
                    setStatus("error");
                });
        }
    };

    const getRightContent = () => {
        //not logged in
        return (
            <Grid container spacing={2} alignContent="space-around" justify="center" className={classes.rightContainer}>
                <Grid item xs={12}>
                    <Typography variant="body1" className={classes.primaryText}>
                        By deleting your account, you will remove all of your content and data associated with it.
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <ButtonBase onClick={() => setConfirmed(!confirmed)} className={classes.checkboxButton}>
                        <div className={classes.unchecked}>{confirmed && <div className={classes.checked} />}</div>
                        <Typography variant="subtitle1" align="left" className={classes.secondaryText}>
                            I agree with the terms and conditions and choose to permanently delete my account
                        </Typography>
                    </ButtonBase>
                </Grid>
                <Grid item xs={12} sm={8} className={classes.itemContainer}>
                    <ButtonWithFeedback
                        status={status}
                        variant="contained"
                        disabled={!confirmed}
                        color="secondary"
                        fullWidth
                        className={classes.button}
                        classes={{ label: classes.buttonLabel }}
                        onClick={deleteAccountClicked}
                        successMessage="Deleted"
                    >
                        Delete account
                    </ButtonWithFeedback>
                </Grid>
                {/* <Grid item xs={12} sm={8}>
                    <Button variant="contained" color="secondary" fullWidth onClick={() => deleteAccount.show(false)}>
                        Nevermind
                    </Button>
                </Grid> */}
            </Grid>
        );
    };

    const getLeftContent = () => {
        return (
            <Grid container spacing={2} alignItems="center" justify="flex-end" className={classes.leftContainer}>
                <Grid item xs={12}>
                    <img src={config.WORDMARK} className={classes.brandIcon} />
                </Grid>
                <Grid item xs={12} sm={10}>
                    <Typography variant="h2" className={classes.primaryTitle}>
                        Delete account
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={10}>
                    <Typography variant="h3" className={classes.secondaryTitle}>
                        Deleting your Scener account is permanent and irreversible.
                    </Typography>
                </Grid>
            </Grid>
        );
    };

    const getBackground = () => {
        return <div className={classes.background} />;
    };

    const getForeground = () => {
        return <DeleteStars style={{ position: "absolute", left: "-12%", top: "-12%", width: "110%", transform: "translate(0%,0%)" }} />;
    };

    return <SplitCard foreground={getForeground()} leftContent={getLeftContent()} rightContent={getRightContent()} background={getBackground()} />;
};

export default DeleteAccount;
