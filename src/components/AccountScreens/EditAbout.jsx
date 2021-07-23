import React, { useState, useEffect } from "react";
import { useApp } from "hooks/Global/GlobalAppState";

import { makeStyles, Grid, Typography, Divider, Box } from "@material-ui/core";
import ToggleTextField from "../ToggleTextField/ToggleTextField";
import TwitterIcon from "@material-ui/icons/Twitter";
import InstagramIcon from "@material-ui/icons/Instagram";
import FacebookIcon from "@material-ui/icons/Facebook";
import YoutubeIcon from "@material-ui/icons/YouTube";
import { TikTok } from "../Icon/Icon";

const useStyles = makeStyles(() => ({
    form: {
        //padding: theme.spacing(1, 2)
    },
    avatar: {
        width: "100%",
        height: "100%"
        //  margin: "auto"
    },
    hero: {
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: "1rem",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        cursor: "pointer"
    },
    dividerColor: {
        background: "linear-gradient(45deg, #8310fe, #6008ff)"
    },
    selectedSocialIcon: {
        borderRadius: "60%",
        background: "#4f2876",
        width: "53px",
        paddingLeft: "6px",
        paddingTop: "3px"
    },
    unSelectedSocialIcon: {
        paddingLeft: "6px",
        paddingTop: "3px"
    }
}));
const EditAbout = ({ title }) => {
    const classes = useStyles();

    const SOCIALS = [
        { name: "twitter", icon: <TwitterIcon style={{ height: "3em", width: "3em" }} />, isActive: true },
        { name: "instagram", icon: <InstagramIcon style={{ height: "3em", width: "3em" }} />, isActive: false },
        { name: "tiktok", icon: <TikTok style={{ height: "3em", width: "3em" }} />, isActive: false },
        { name: "facebook", icon: <FacebookIcon style={{ height: "3em", width: "3em" }} />, isActive: false },
        { name: "youtube", icon: <YoutubeIcon style={{ height: "3em", width: "3em" }} />, isActive: false }
    ];

    const {
        auth: { user, update }
    } = useApp();

    const [about, setAbout] = useState("");
    const [aboutError, setAboutError] = useState(null);
    const [error, setError] = useState(null);
    const [loading_, setLoading] = useState(false);
    const [socialIcons, setSocialIcons] = useState(SOCIALS);

    useEffect(() => {
        clearErrors();
        return () => {
            clearForm();
        };
    }, []);

    useEffect(() => {
        if (user) {
            setAbout(user.about || "");
        }
    }, [user]);

    const saveField = (field) => {
        console.log("** SAVE ***", field);
        if (!validate(field)) {
            console.log("ERROR!", field);
            return Promise.resolve(false);
        }
        let updates = { profile: field };

        return update(updates)
            .then((res) => {
                console.log(res);
                setLoading(false);

                return true;
            })
            .catch((e) => {
                if (e) {
                    setError(e.message);
                }
                setLoading(false);
                return false;
            });
    };

    const validate = (field) => {
        let valid = true;
        clearErrors();

        if (!field) {
            return false;
        }

        return valid;
    };

    const clearForm = () => {
        clearErrors();
        if (user) {
            setAbout(user.about || "");
        }
    };

    const clearErrors = () => {
        setError(null);
        setAboutError(null);
    };

    const updateActiveSocialIcon = (selectedIconName) => {
        const updatedIcons = socialIcons.map((icon) => {
            icon.isActive = icon.name === selectedIconName;

            return icon;
        });

        setSocialIcons(updatedIcons);
    };

    const toTitleCase = (str) => {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };

    return (
        <Grid container spacing={1} alignItems="center" justify="center" direction="column">
            <Grid item container xs={12} spacing={2}>
                {title && (
                    <Grid item xs={12}>
                        <Typography align="center" variant="h3">
                            {title}
                        </Typography>
                    </Grid>
                )}
                <Grid item xs={12}>
                    {error && (
                        <Typography variant={"body1"} align={"center"} style={{ width: "100%" }} color="error">
                            {error}
                        </Typography>
                    )}
                </Grid>

                <Grid item xs={12}>
                    <form className={classes.form}>
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <ToggleTextField
                                    multiline={true}
                                    characterLimit={300}
                                    rows={3}
                                    label={"about me"}
                                    placeholder={"Say something about yourself! What are you watching? What are your favorite shows ever?"}
                                    error={aboutError}
                                    value={about}
                                    onSave={(value) => {
                                        return saveField({ about: value });
                                    }}
                                    saveOnEnter
                                />
                            </Grid>

                            <Grid item xs={12} style={{ marginTop: "4rem" }}>
                                <Typography variant="h6" style={{ marginLeft: "1rem" }}>
                                    Social Links - Click to edit
                                </Typography>
                            </Grid>

                            <Grid item xs={12} style={{ marginBottom: "1rem" }}>
                                <Divider variant="fullWidth" light={true} classes={{ root: classes.dividerColor }} />
                            </Grid>

                            {socialIcons.map((s) => (
                                <Grid container key={s.name} item xs={2} justify={"space-between"} onClick={() => updateActiveSocialIcon(s.name)}>
                                    <Box className={`${s.isActive ? classes.selectedSocialIcon : classes.unSelectedSocialIcon}`}>{s.icon}</Box>
                                </Grid>
                            ))}

                            <Grid item xs={12} style={{ marginTop: "1rem" }}>
                                {socialIcons.map((s) => (
                                    <Grid key={s.name} item xs={12}>
                                        {s.isActive && (
                                            <ToggleTextField
                                                editTitle={user[s.name] ? "EDIT" : "ADD"}
                                                label={toTitleCase(s.name)}
                                                value={user[s.name] || ""}
                                                onSave={(value) => {
                                                    return saveField({ [s.name]: value.replace(/^(https?:\/\/)?(.+?\.com\/)?@?/gi, "") });
                                                }}
                                                saveOnEnter
                                            />
                                        )}
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default EditAbout;
