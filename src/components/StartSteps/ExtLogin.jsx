import React, { useState } from "react";
import { Grid, Button, makeStyles, Typography, Box } from "@material-ui/core";
import { useExtension } from "hooks/Extension/Extension";
import { useEffect } from "react";
import { LoadingDots } from "../Icon/Icon";
import ServiceIcon from "../Icon/ServiceIcon";
import config from "../../config";
import LaunchIcon from '@material-ui/icons/Launch';
import { useSettings } from "hooks/Settings/Settings";
import withAppState from "components/Page/withAppState";

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
        padding: theme.spacing(2),
    }
}));

function ExtLogin({ service, onReady }) {
    const classes = useStyles();
    const { isExtensionInstalled, requestServicePermissions, checkServicePermissions, servicePermissions, country } = useExtension();
    const [showWarning, setShowWarning] = useState(false);
    const [serviceSetting, setServiceSetting] = useState(null);
    const [serviceName, setServiceName] = useState(null);
    const settings = useSettings();

    useEffect(() => {

        if (service && settings && isExtensionInstalled && config.SERVICE_LIST[service]) {

          let hasSetting = settings.getItem("service." + service);
          setServiceSetting(hasSetting);

          if (hasSetting && config.SERVICE_LIST[service].promptStart) {
            setServiceName(config.SERVICE_LIST[service].promptStart[hasSetting].title);
          } else {
            setServiceName(config.SERVICE_LIST[service].name);
          }

          setShowWarning(true);
        }
    }, [service, isExtensionInstalled, settings]);

    const signin = () => {

      if (service && config.SERVICE_LIST[service]) {

        let signinURL = config.SERVICE_LIST[service].promptLogin;

        //console.log("** SERV LOGIN **", serviceSetting);

        if (serviceSetting && config.SERVICE_LIST[service].promptStart[serviceSetting] && config.SERVICE_LIST[service].promptStart[serviceSetting].promptLogin) {
          signinURL = config.SERVICE_LIST[service].promptStart[serviceSetting].promptLogin;
        }

        if (signinURL) {
          if (config.SERVICE_LIST[service].hostConverter) {
            let startUrl = new URL(config.getServiceStart(service, country, serviceSetting));
            signinURL = signinURL.replace(config.SERVICE_LIST[service].hostConverter, startUrl.hostname);
          }

          window.open(signinURL, "_blank");
        }

      }
    };

    return showWarning ? (
        <Box className={classes.container}>
            <Grid container justify="center" alignContent="center" className={classes.contentContainer}>
                <Grid item xs={12} sm={6} className={classes.boxContent}>
                  <Box>
                    <Typography variant="h2" align="center" style={{marginBottom: "1rem"}}>
                        {serviceName}
                    </Typography>
                  </Box>
                    <Box>
                        <Typography variant="h3" align="center" >
                            Logged In?
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} className={`${classes.boxContent} ${classes.boxBackground}`}>
                    <Box>
                        <Typography variant="body1" paragraph className={classes.paragraph}>
                            If you are not already signed into your {serviceName} account in Chrome, do so first.
                        </Typography>
                        <Box className={classes.buttonContainer}>
                          <Button className={classes.button} variant="outlined" color="primary" size="large" onClick={signin}>
                              Sign into {serviceName} <LaunchIcon style={{marginLeft: "0.5rem", fontSize: "1.5rem"}}/>
                          </Button>

                        </Box>
                        <Box className={classes.buttonContainer}>
                            <Button className={classes.button} variant="contained" color="primary" size="large" onClick={onReady}>
                                I{"'"}m signed in and ready!
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

export default withAppState(ExtLogin);
