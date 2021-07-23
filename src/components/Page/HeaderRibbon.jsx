
import { useEffect, useState } from "react";
import { makeStyles, Grid, Button } from "@material-ui/core";
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import Cookies from "utils/Cookies";
import { isMobile } from "utils/Browser";

const useStyles = makeStyles((theme_) => ({
    ribbon: {
      background: `gradient(linear, left top, right top, from(${theme_.palette.scener.blackberry}), to(${theme_.palette.scener.gradientDark}))`,
      padding: "0rem"
    },
    ribbonsm: {
      background: `gradient(linear, left top, right top, from(${theme_.palette.scener.blackberry}), to(${theme_.palette.scener.gradientDark}))`,
      padding: "0rem"
    },
    fullbar: {
      backgroundColor: "transparent",
      borderRadius: 0,
    },
    navBar: {}
}));

function HeaderRibbon ({ elevated, title, url, showOnCookieMatch, icon=true }) {
  const classes = useStyles();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
      if (showOnCookieMatch) {
        if (Cookies.get(showOnCookieMatch)) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      } else {
        setVisible(true);
      }
  }, [showOnCookieMatch]);

  return (
      (visible && !isMobile()) ? <Grid container justify="center" className={elevated ? classes.ribbonsm : classes.ribbon}>
        <Grid item xs={12} sm={12}>
            <Button href={url} target="_blank" variant="contained" color="primary" fullWidth className={classes.fullbar}>
                {icon && <NewReleasesIcon color="primary" style={{fontSize: "2rem", marginRight: "0.5rem"}}/>} {title}
            </Button>
        </Grid>
      </Grid> : <></>
    );
}
export default HeaderRibbon;
