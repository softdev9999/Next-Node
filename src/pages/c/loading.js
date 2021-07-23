import { CircularProgress, Container, Grid, Typography, Button } from "@material-ui/core";
import Head from "next/head";
import useBroadcastChannel from "hooks/useBroadcastChannel/useBroadcastChannel";
import { useState, useEffect, useRef } from "react";
import { Scener } from "components/Icon/Icon";
import SyncProblemIcon from '@material-ui/icons/SyncProblem';

export default function LoadingPage() {

  const statusTimer = useRef(null);
  const totalDelay = useRef(0);
  const [error, setError] = useState(null);
  const [timeoutExceeded, setTimeoutExceeded] = useState(false);
  const { postMessage } = useBroadcastChannel({ name: "TheaterSetup" });

  useEffect(() => {
      startLoadingTimeout(5000);

      () => {
          stopLoadingTimeout();
      };
  }, []);


  const startLoadingTimeout = (delay, reset = false) => {
      if (!statusTimer.current || reset) {
          console.log("Starting loading check timer...", delay, totalDelay.current);
          clearTimeout(statusTimer.current);
          statusTimer.current = setTimeout(() => {
              onLoadingTimeout(delay);
          }, delay);
      }
  };

  const stopLoadingTimeout = () => {
      clearTimeout(statusTimer.current);
  };

  const onLoadingTimeout = (time) => {
      /*if (totalDelay.current >= 10000 && totalDelay.current % 10000 == 0) {
          if (time && postMessage) {
              postMessage({
                  name: "LoadingTimeout",
                  time: totalDelay.current
              });
          }
      }*/

      totalDelay.current = totalDelay.current + time;

      if (totalDelay.current >= 60000) {
          setError("Scener is having trouble connecting.");
          setTimeoutExceeded(true);
      } else {
          if (totalDelay.current >= 30000) {
              setError("Scener is having trouble connecting...");
          } else if (totalDelay.current >= 16000) {
              setError("Scener is still trying to connect...");
          }

          startLoadingTimeout(5000, true);
      }
  };

  const onFullReload = () => {
      setError(null);
      setTimeoutExceeded(false);

      totalDelay.current = 0;

      startLoadingTimeout(5000, true);

      if (postMessage) {
          postMessage({
              name: "LoadingTimeout",
              time: 60000
          });
      }

      //router.push("/c/loading", { shallow: true });
  };

    return (
        <Container>
            <Head>
                <title>Scener – Loading...</title>
            </Head>

            <Container disableGutters style={{ padding: "3rem", width: "100vw", height: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
              <Grid container spacing={2} style={{ height: "100vh", minHeight: "100vh" }} justify="center" alignContent="center">
                  <Grid item>
                      {timeoutExceeded ? <SyncProblemIcon style={{fontSize: "6rem"}} /> : <CircularProgress color="inherit" size={"10vh"} />}
                  </Grid>
                  {error && (
                      <Grid item xs={12}>
                          <Typography variant={timeoutExceeded ? "h3" : "body1"} align="center" style={{ animation: "pulse-50 2s infinite linear" }}>
                              {error}
                          </Typography>
                      </Grid>
                  )}
                  <Grid item xs={12} align="center">
                      {timeoutExceeded ?
                        <><Button variant="contained" color="primary" onClick={onFullReload} style={{marginTop: "2rem"}}>
                          Try Again
                      </Button>
                      <Typography variant="body1" align="center" style={{marginTop: "3rem", opacity: "0.7"}}>
                        Need help? Contact us at support@scener.com
                    </Typography></> :
                        <Typography variant="h2" align="center">
                          <Scener style={{ position: "relative", top: "2rem", width: "5rem", height: "5rem" }} /> loading...
                      </Typography>}
                  </Grid>
              </Grid>
            </Container>
        </Container>
    );
}
