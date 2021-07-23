import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "hooks/Global/GlobalAppState";

import { makeStyles, useMediaQuery, useTheme, Box, Grid, Typography, Avatar } from "@material-ui/core";
import ImageCropper from "../ImageCropper/ImageCropper";
import FixedRatioBox from "../FixedRatioBox/FixedRatioBox";
import ToggleTextField from "../ToggleTextField/ToggleTextField";

const useStyles = makeStyles((theme) => ({
    avatarWrapperContainer: {
        [theme.breakpoints.down("xs")]: {
            width: theme.functions.rems(100),
            height: theme.functions.rems(100)
        }
    },
    avatarContainer: {
        [theme.breakpoints.down("xs")]: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: theme.functions.rems(128),
            backgroundColor: theme.functions.rgba(theme.palette.common.white, 0.1)
        }
    },
    avatar: {
        width: "100%",
        height: "100%"
    },
    hero: {
        position: "relative",
        width: "100%",
        height: "85%",
        //  borderRadius: "1rem",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        cursor: "pointer"
    },
    fieldContainer: {
        paddingTop: theme.functions.rems(20),
        [theme.breakpoints.down("xs")]: {
            paddingTop: 0
        }
    }
}));
const EditProfile = ({ title }) => {
    const classes = useStyles();
    const theme = useTheme();
    const mobileScreen = useMediaQuery(theme.breakpoints.down("xs"));
    const {
        auth: { user, update, uploadUserImage }
    } = useApp();
    const defaultImageModifier = useMemo(() => (user && user.id ? (parseInt(user.id, 10) % 3) + 1 : 1), [user]);

    const [displayName, setDisplayName] = useState("");
    const [displayNameError, setDisplayNameError] = useState(null);
    const [bio, setBio] = useState("");
    const [bioError, setBioError] = useState(null);
    const [website, setWebsite] = useState("");
    const [websiteError, setWebsiteError] = useState(null);
    const [error, setError] = useState(null);
    const [loading_, setLoading] = useState(false);
    const [profile, setProfile] = useState(
        user && user.profileImageUrl ? user.profileImageUrl : "/images/profiledefault-" + (defaultImageModifier || 1) + ".jpg"
    );
    const [banner, setBanner] = useState(
        user && user.bannerImageUrl ? user.bannerImageUrl : "/images/profilebanner-" + (defaultImageModifier || 1) + ".jpg"
    );
    /* const [wall, setWall] = useState(
        user && user.wallImageUrl ? user.wallImageUrl : "/images/galaxy-pc-darker.jpg"
    );*/
    const [profileImageStatus, setProfileImageStatus] = useState(null);
    const [bannerImageStatus, setBannerImageStatus] = useState(null);

    ///  const [wallImageStatus, setWallImageStatus] = useState(null);

    useEffect(() => {
        clearErrors();
        return () => {
            clearForm();
        };
    }, []);

    useEffect(() => {
        if (user) {
            setProfile(user.profileImageUrl ? user.profileImageUrl : "/images/profiledefault-" + (defaultImageModifier || 1) + ".jpg");
            setBanner(user.bannerImageUrl ? user.bannerImageUrl : "/images/profilebanner-" + (defaultImageModifier || 1) + ".jpg");
            //   setWall(user.wallImageUrl ? user.wallImageUrl : "/images/galaxy-pc-darker.jpg");
            setDisplayName(user.displayName || "");
            setBio(user.bio || "");
            setWebsite(user.website || "");
        }
    }, [user]);

    const saveField = (field) => {
        console.log("save field", field);
        if (!validate(field)) {
            console.log("ERROR!", field);
            return Promise.resolve(false);
        }
        setLoading(true);
        let updates = field;

        if (typeof field.displayName == "undefined") {
            updates = { profile: field };
        }

        return update(updates)
            .then((res) => {
                console.log(res);
                setLoading(false);
                res;
                return true;
            })
            .catch((e) => {
                setLoading(false);

                setError(e.message);

                return false;
            });
    };

    const validate = (field) => {
        let valid = true;
        clearErrors();

        if (!field) {
            return false;
        }

        if (field.website && !field.website.match(/^(?:https?:\/\/)?(?:[\w-])+\.[\w-]{2,6}/i)) {
            setWebsiteError("Invalid website");
            valid = false;
        }

        if (typeof field.displayName === "string" && (field.displayName.length < 1 || field.displayName.length > 32)) {
            setDisplayNameError("Display name must be between 1-32 characters");
            valid = false;
        }

        if (field.bio && field.bio.length > 140) {
            setBioError("Bio must be less than 140 characters");
            valid = false;
        }

        return valid;
    };

    const clearForm = () => {
        clearErrors();
        if (user) {
            setProfile(user.profileImageUrl);
            setBanner(user.bannerImageUrl);
            //   setWall(user.wallImageUrl);
            setDisplayName(user.displayName || "");
            setBio(user.bio || "");
            setWebsite(user.website || "");
        }
    };

    const clearErrors = () => {
        setError(null);

        setDisplayNameError(null);
        setBioError(null);
        setWebsiteError(null);
    };

    const onFinishedProfileImageCrop = (image) => {
        setProfileImageStatus("loading");
        uploadUserImage({ image, key: "profile" })
            .then((res) => {
                if (res) {
                    setProfileImageStatus("success");
                } else {
                    throw "Error";
                }
            })
            .catch((e) => {
                setProfileImageStatus("error");
            });
    };

    const onFinishedBannerImageCrop = (image) => {
        setBannerImageStatus("loading");
        uploadUserImage({ image, key: "banner" })
            .then((res) => {
                if (res) {
                    setBannerImageStatus("success");
                } else {
                    throw "Error";
                }
            })
            .catch((e) => {
                setBannerImageStatus("error");
            });
    };

    /* const onFinishedWallImageCrop = (image) => {
        setWallImageStatus("loading");
        uploadUserImage({ image, key: "wall" }).then((res) => {
                  if (res) {
                   setWallImageStatus("success");
                } else {
                    throw "Error";
                }
             
        }) .catch((e) => {
                setWallImageStatus("error");
            });;
    };*/

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
                {error && (
                    <Grid item xs={12}>
                        <Typography variant={"body1"} align={"center"} style={{ width: "100%" }} color="error">
                            {error}
                        </Typography>
                    </Grid>
                )}
                {
                    <Grid item xs={12}>
                        <Grid container justify={"space-between"} spacing={2}>
                            <Grid item xs={12} sm={3} md={3}>
                                <Box className={classes.avatarContainer}>
                                    <ImageCropper
                                        aspectRatio={1}
                                        round={true}
                                        onFinished={onFinishedProfileImageCrop}
                                        onError={() => {
                                            setProfileImageStatus("error");
                                        }}
                                        targetWidth={300}
                                        showEditIcon
                                        editIconRight={(mobileScreen && "-24vw") || 0}
                                        editIconBottom={-5}
                                        title={"edit profile image"}
                                        status={profileImageStatus}
                                        classname={classes.avatarWrapperContainer}
                                        onStatusTimeout={setProfileImageStatus}
                                    >
                                        <FixedRatioBox xs={1}>
                                            <Avatar alt={displayName} className={classes.avatar} src={profile} />
                                        </FixedRatioBox>
                                    </ImageCropper>
                                </Box>
                            </Grid>
                            {/*     <Grid item xs={12} sm={4} md={4}>
                                <ImageCropper
                                    aspectRatio={1}
                                    round={false}
                                    onFinished={onFinishedWallImageCrop}
                                    targetWidth={1000}
                                    showEditIcon
                                    title={"edit host wallpaper"}
                                    status={wallImageStatus}
                                    onStatusTimeout={setWallImageStatus}
                                >
                                  <FixedRatioBox xs={1}>
                                      <div
                                          className={classes.hero}
                                          style={{
                                              backgroundImage: `url(${wall})`
                                          }}
                                      ></div>
                                  </FixedRatioBox>
                                </ImageCropper>
                            </Grid>*/}
                            <Grid item xs={12} sm={8} md={8}>
                                <ImageCropper
                                    aspectRatio={10 / 4}
                                    onFinished={onFinishedBannerImageCrop}
                                    targetWidth={1000}
                                    showEditIcon
                                    onError={() => {
                                        setBannerImageStatus("error");
                                    }}
                                    editIconRight={(mobileScreen && 10) || -10}
                                    editIconBottom={(mobileScreen && 25) || 0}
                                    title={"edit banner"}
                                    status={bannerImageStatus}
                                    onStatusTimeout={setBannerImageStatus}
                                    borderRadius={1}
                                    height={"85%"}
                                >
                                    <FixedRatioBox xs={0.4}>
                                        <div
                                            className={classes.hero}
                                            style={{
                                                backgroundImage: `url(${banner})`
                                            }}
                                        ></div>
                                    </FixedRatioBox>
                                </ImageCropper>
                            </Grid>
                            <Grid item xs={12}>
                                {bannerImageStatus == "error" || profileImageStatus == "error" ? (
                                    <Typography color="error">Please select a valid image file (jpeg or png) under 5MB.</Typography>
                                ) : null}
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} className={classes.fieldContainer}>
                            <Grid item xs={12}>
                                <ToggleTextField
                                    placeholder={"Display name"}
                                    autoComplete={"name"}
                                    characterLimit={32}
                                    label={"Display name"}
                                    error={displayNameError}
                                    value={displayName}
                                    onSave={(value) => {
                                        return saveField({ displayName: value });
                                    }}
                                    saveOnEnter
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <ToggleTextField
                                    variant={"outlined"}
                                    characterLimit={140}
                                    label={"Bio (140 characters or less)"}
                                    placeholder={"a one line description of yourself"}
                                    error={bioError}
                                    value={bio}
                                    saveOnEnter
                                    onSave={(value) => {
                                        return saveField({ bio: value });
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <ToggleTextField
                                    label={"Website url"}
                                    placeholder={"mywebsite.com"}
                                    characterLimit={100}
                                    error={websiteError}
                                    value={website}
                                    onSave={(value) => {
                                        return saveField({ website: value.replace(/^https?:\/\//gi, "") });
                                    }}
                                    saveOnEnter
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                }
            </Grid>
        </Grid>
    );
};

export default EditProfile;
