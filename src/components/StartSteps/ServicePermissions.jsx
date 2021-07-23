import React, { useState } from "react";
import { Grid, Button, makeStyles, Typography, Box } from "@material-ui/core";
import { useExtension } from "hooks/Extension/Extension";
import { useEffect } from "react";
import { LoadingDots } from "../Icon/Icon";
import ServiceIcon from "../Icon/ServiceIcon";
import config from "../../config";

const useStyles = makeStyles((theme) => ({
    container: {
        height: "calc(100vh - 35vh)",
        minHeight: "calc(100vh - 35vh)",
        backgroundImage: 'url("/images/cards/ServicePermission.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        [theme.breakpoints.down("xs")]: {
            height: "auto"
        }
    },
    contentContainer: {
        height: "100%"
    },
    boxContent: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        height: "100%",
        padding: theme.spacing(20, 8),
        [theme.breakpoints.down("xs")]: {
            padding: "5rem 4rem"
        }
    },
    boxBackground: {
        backgroundColor: "rgba(16,8,53,0.8)"
    },
    primary: {
        fontSize: theme.spacing(5),
        fontWeight: 800,
        lineHeight: theme.spacing(5.7),
        color: theme.palette.common.white,
        marginBottom: theme.spacing(2)
    },
    secondary: {
        fontSize: theme.spacing(2.5),
        fontWeight: 800,
        color: theme.palette.common.white
    },
    paragraph: {
        fontSize: 18,
        fontWeight: 300,
        lineHeight: theme.spacing(3),
        marginBottom: theme.spacing(3)
    },
    buttonContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: theme.spacing(5)
    },
    button: {
        backgroundColor: theme.palette.secondary.main,
        boxShadow: "4px 4px 10px 0 rgba(0,0,0,0.18)",
        borderColor: theme.palette.secondary.main,
        paddingLeft: theme.spacing(8),
        paddingRight: theme.spacing(8),
        "&:hover,&:active,&:focus": {
            backgroundColor: theme.palette.secondary.main,
            boxShadow: "4px 4px 10px 0 rgba(0,0,0,0.18)",
            borderColor: theme.palette.secondary.main
        }
    }
}));

function ServicePermissions({ service, onAllowed, onDenied }) {
    const classes = useStyles();
    const { isExtensionInstalled, requestServicePermissions, checkServicePermissions, servicePermissions } = useExtension();
    const [showWarning, setShowWarning] = useState(false);
    const [serviceName, setServiceName] = useState(null);

    useEffect(() => {
        let permissionsToRequest = service && config.SERVICE_LIST[service] && config.SERVICE_LIST[service].permissionList;
        setServiceName(config.SERVICE_LIST[service] && config.SERVICE_LIST[service].name);

        if (servicePermissions !== null && service && isExtensionInstalled) {

          if (!permissionsToRequest || servicePermissions.has(service)) {
            setShowWarning(false);
            onAllowed();
          } else {
              checkServicePermissions(service).then((res) => {
              console.log("CHECK PERMISSIONS FOR ", service, res);

              if (res) {
                setShowWarning(false);
                onAllowed();
              } else {
                setShowWarning(true);
              }
            });
          }
        }
    }, [servicePermissions, service, isExtensionInstalled]);

    const request = () => {
        requestServicePermissions(service).then((res) => {
            if (res) {
                setShowWarning(false);
                onAllowed();
            } else {
                onDenied && onDenied();
            }
        });
    };

    return showWarning ? (
        <Box className={classes.container}>
            <Grid container justify="center" alignContent="center" className={classes.contentContainer}>
                <Grid item xs={12} sm={6} className={classes.boxContent}>
                    <Box height="100%">
                        <Typography component="h4" className={classes.primary}>
                            Allow {serviceName} Permissions
                        </Typography>
                        <Typography component="h6" className={classes.secondary}>
                            Your privacy is always respected.
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} className={`${classes.boxContent} ${classes.boxBackground}`}>
                    <Box className={classes.buttonContainer} style={{padding: "3rem"}}>
                      <ServiceIcon permissionToUse={true} centered name={service} />
                    </Box>
                    <Box>
                        <Typography variant="body1" paragraph className={classes.paragraph}>
                            Scener needs permission to read and change website data {serviceName ? ("on " + serviceName) : "" } so that you can watch with others.
                        </Typography>
                        <Typography variant="body2" paragraph className={classes.paragraph}>
                            Scener does not collect any personal details or read your browser history. Find more details in our{" "}
                            <a style={{ color: "inherit" }} href="https://scener.com/terms#privacy" target="_blank" rel={"noreferrer"}>
                                privacy policy
                            </a>
                            .
                        </Typography>
                        <Box className={classes.buttonContainer}>
                            <Button className={classes.button} variant="contained" color="primary" size="large" onClick={request}>
                                Got It!
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    ) : (
        <Grid container spacing={2} style={{ height: "100vh", minHeight: "100vh" }} justify="center" alignContent="center">
            <Grid item xs={6} sm={3}>
                <LoadingDots />
            </Grid>
        </Grid>
    );
}

export default ServicePermissions;
