import React, { useState, useCallback, useEffect, forwardRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    Dialog,
    DialogContent,
    Toolbar,
    Slide,
    Grid,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Hidden,
    Divider,
    Typography,
    ListItemIcon,
    useMediaQuery,
    useTheme,
    Box
} from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import EditProfile from "../AccountScreens/EditProfile";
import EditAccount from "../AccountScreens/EditAccount";
import EditSchedule from "../AccountScreens/EditSchedule";
import CloseIcon from "@material-ui/icons/CloseRounded";
import EditAbout from "../AccountScreens/EditAbout";
import ArrowRight from "@material-ui/icons/ArrowForwardIosOutlined";

const useStyles = makeStyles((theme) => ({
    paper: {
        borderRadius: 0,
        backgroundImage: theme.gradients.create("47.52", `${theme.palette.primary.dark} 0%`, `${theme.palette.secondary.light} 100%`)
    },
    paperScrollPaper: {
        overflow: "visible",
        minHeight: "calc(100% - 200px)"
    },
    list: {
        paddingRight: theme.functions.rems(34)
    },
    menuItem: {
        borderTopRightRadius: "0em",
        borderBottomRightRadius: "0em",
        paddingLeft: theme.spacing(6),
        margin: theme.spacing(1, 0, 1),
        maxHeight: theme.functions.rems(50)
    },
    selected: {
        background: theme.gradients.create("24.37", `${theme.palette.primary.main} 0%`, `${theme.palette.primary.lightest} 100%`)
    },
    selectedMenuItem: {
        background: `linear-gradient(  45deg, ${theme.palette.scener.supernova},  ${theme.palette.scener.gradientLight})`
    },
    closeButtonRoot: {
        position: "absolute",
        right: "-2.5rem",
        top: "-2.5rem"
    },
    // toolbar: {
    //     position: "sticky",
    //     left: 0,
    //     right: 0,
    //     top: 0,
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "space-between",
    //     flexFlow: "row nowrap"
    // },
    tab: {
        paddingTop: theme.spacing(2),
        paddingBototm: theme.spacing(2)
    },
    appBar: {
        position: "relative",
        background: "transparent"
    },
    toolbar: {
        minHeight: theme.functions.rems(65)
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
        fontSize: theme.functions.rems(20),
        fontWeight: 800,
        letterSpacing: 0,
        lineHeight: theme.functions.rems(24)
    },
    content: {
        paddingLeft: 0,
        position: "relative",
        paddingTop: theme.spacing(6),
        [theme.breakpoints.down("xs")]: {
            paddingLeft: theme.spacing(6)
        },
        '@media (max-width: 400px)': {
            paddingLeft: theme.spacing(2),
        }
    },
    divider: {
        background: "linear-gradient(45deg, #8310fe, #6008ff)",
        height: 2
    },
    iconSize: {
        fontSize: theme.functions.rems(20)
    }
}));
const Transition = forwardRef((props, ref) => <Slide direction="right" ref={ref} {...props} />);
const EditAccountPopup = ({ open, onClose, defaultTab = 0, content }) => {
    const classes = useStyles();
    const [tabIndex, setTabIndex] = useState(defaultTab);
    const theme = useTheme();
    const mobileScreen = useMediaQuery(theme.breakpoints.down("xs"));
    useEffect(() => {
        return () => setTabIndex(-1);
    }, []);

    const getTitle = useCallback(() => {
        switch (tabIndex) {
            case 0: {
                return "Profile";
            }
            case 1: {
                return "About";
            }
            case 2: {
                return "Schedule";
            }
            case 3:
            default: {
                return "Account";
            }
        }
    }, [tabIndex]);

    useEffect(() => {
        setTabIndex(defaultTab);
    }, [mobileScreen, defaultTab]);

    useEffect(() => {
        if (!mobileScreen && tabIndex < 0) {
            setTabIndex(0);
        }
        return () => {};
    }, [mobileScreen, tabIndex]);
    const handleBack = () => {
        if (tabIndex < 0) {
            onClose();
        } else {
            setTabIndex(-1);
        }
    };
    const getContent = useCallback(() => {
        switch (tabIndex) {
            case 0: {
                return (
                    <EditProfile
                        onCancel={onClose}
                        onFinished={() => {
                            onClose();
                        }}
                    />
                );
            }
            case 1: {
                return (
                    <EditAbout
                        onCancel={onClose}
                        onFinished={() => {
                            onClose();
                        }}
                    />
                );
            }
            case 2:
                return (
                    <EditSchedule
                        content={content}
                        onCancel={onClose}
                        onBack={handleBack}
                        onFinished={() => {
                            onClose();
                        }}
                    />
                );
            case 3: {
                return (
                    <EditAccount
                        onCancel={onClose}
                        onFinished={() => {
                            onClose();
                        }}
                    />
                );
            }
            default: {
                return (
                    <List>
                        {["Profile", "About", "Schedule", "Account"].map((text, index) => (
                            <ListItem
                                button
                                key={text}
                                onClick={() => setTabIndex(index)}
                                selected={index == tabIndex}
                                classes={{ root: classes.menuItem, selected: classes.selectedMenuItem }}
                            >
                                <ListItemText primary={text} primaryTypographyProps={{ style: { fontWeight: "bold" } }} />
                                <ListItemIcon>
                                    <ArrowRight />
                                </ListItemIcon>
                            </ListItem>
                        ))}
                    </List>
                );
            }
        }
    }, [tabIndex]);
    let transitionProps = {};
    if (mobileScreen) {
        transitionProps = Object.assign({}, transitionProps, {
            TransitionComponent: Transition
        });
    }
    return (
        <Dialog
            open={open}
            maxWidth="lg"
            fullScreen={mobileScreen}
            onClose={onClose}
            classes={{ paper: classes.paper, paperScrollPaper: classes.paperScrollPaper }}
            {...transitionProps}
        >
            <Hidden mdDown>
                <IconButton classes={{ root: classes.closeButtonRoot }} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Hidden>
            {mobileScreen && (
                <Box component="div" elevation={0} className={classes.appBar}>
                    <Toolbar className={classes.toolbar}>
                        <IconButton edge="start" color="inherit" onClick={handleBack}>
                            <ArrowBackIosIcon className={classes.iconSize} />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {getTitle(tabIndex)}
                        </Typography>
                    </Toolbar>
                    <Divider className={classes.divider} />
                </Box>
            )}
            <DialogContent className={classes.content}>
                <Grid container align="flex-start" spacing={1}>
                    <Grid item xs={12} sm={3} md={3}>
                        <Hidden xsDown>
                            <List className={classes.list}>
                                {["Profile", "About", "Schedule", "Account"].map((text, index) => (
                                    <ListItem
                                        button
                                        key={text}
                                        onClick={() => setTabIndex(index)}
                                        selected={index == tabIndex}
                                        classes={{ root: classes.menuItem, selected: classes.selected }}
                                    >
                                        <ListItemText primary={text} primaryTypographyProps={{ style: { fontWeight: "bold" } }} />
                                    </ListItem>
                                ))}
                            </List>
                        </Hidden>
                    </Grid>
                    <Grid item xs={12} sm={9} md={9} style={{ height: "60vh" }}>
                        {getContent()}
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default EditAccountPopup;
