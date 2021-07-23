import React from "react";
//import SyncIcon from "@material-ui/icons/SyncRounded";
import { Typography, withStyles } from "@material-ui/core";

import Netflix from "./svg/Netflix.svg";
import Crunchyroll from "./svg/Crunchyroll.svg";
import Disney from "./svg/Disney.svg";
//import HBO from "./svg/HBO.svg";
//import HBOGO from "./svg/HBOGO.svg";
import HBOMax from "./svg/HBOMax.svg";
//import HBONOW from "./svg/HBONOW.svg";
import Hotstar from "./svg/Hotstar.svg";
import Pluto from "./svg/Pluto.svg";
import Peacock from "./svg/Peacock.svg";
import Shudder from "./svg/Shudder.svg";

import Hulu from "./svg/Hulu.svg";
import Alamo from "./svg/Alamo.svg";
import Showtime from "./svg/Showtime.svg";
import Funimation from "./svg/Funimation-Logo.svg";
import PrimeVideo from "./svg/PrimeVideo.svg";
import Vimeo from "./svg/Vimeo.svg";
import YouTube from "./svg/YouTube.svg";

import config from "../../config";

const ServiceIcon = ({ name, width, height, centered, shadow, opacity, iconOnly, permissionToUse, classes }) => {
   // const theme = useTheme();

    let customHeight = height ? height : "100%";
    let customWidth = width ? width : customHeight == "100%" ? "100%" : "auto";

    let otherStyles =   {
      opacity : opacity ? opacity : 1,
      filter: shadow ? `drop-shadow( 0rem 0rem 0.2rem rgba(0, 0, 0, 0.8))
      drop-shadow( 0rem 0rem 0.1rem rgba(0, 0, 0, 0.6))` : "none",
      transformOrigin: centered ? "center" : "left",
      width: customWidth,
      height: customHeight,
      fontSize: customHeight == "100%" ? "1.5rem" : customHeight
    };

    let chosenClass = classes.serviceLogo;

    // if permissionToUse is not set, use the config permission. We will not display icons in areas we do not explicity set this
    if (!permissionToUse && config.SERVICE_LIST[name] && !config.SERVICE_LIST[name].logoPermission) {
      otherStyles.height = "auto";
      return <Typography align={centered ? "center" : "left"} className={chosenClass} style={otherStyles}>{config.SERVICE_LIST[name].name}</Typography>;
    }

    switch(name) {
      case 'netflix':
        return <Netflix className={chosenClass} style={otherStyles} />;
      case 'disney':
        otherStyles.transform = customWidth != "100%" ? "scale(1.8)" : "";
        return <Disney className={chosenClass} style={otherStyles} />;
      case 'hbo':
      case 'hbomax':
        otherStyles.transform = customWidth != "100%" ? "scale(0.8)" : "";
        return <HBOMax className={chosenClass} style={otherStyles} />;
      case 'hulu':
        otherStyles.transform = customWidth != "100%" ? "" : "scale(0.8)";
        return <Hulu className={chosenClass} style={otherStyles} />;
      case 'alamo':
        return <Alamo className={chosenClass} style={otherStyles}  />;
      case 'youtube':
        return <YouTube className={chosenClass} style={otherStyles} />;
      case 'funimation':
        otherStyles.transform = customWidth != "100%" ? "scale(0.8)" : "scale(1.1)";
        return <Funimation className={chosenClass} style={otherStyles}  />;
      case 'crunchyroll':
        otherStyles.transform = "scale(1.2)";
        return <Crunchyroll className={chosenClass} style={otherStyles}  />;
      case 'prime':
        otherStyles.transform = customWidth != "100%" ? "scale(1.5)" : "";
        return <PrimeVideo className={chosenClass} style={otherStyles}  />;
      case 'vimeo':
        return <Vimeo className={chosenClass} style={otherStyles} />;
      case 'hotstar':
        return <Hotstar className={chosenClass} style={otherStyles} />;
      case 'pluto':
          return <Pluto className={chosenClass} style={otherStyles} />;
      case 'showtime':
          otherStyles.transform = customWidth != "100%" ? "scale(1.6)" : "";
          return <Showtime className={chosenClass} style={otherStyles} />;
      case 'peacock':
          otherStyles.transform = customWidth != "100%" ? "scale(1.5)" : "";
          return <Peacock className={chosenClass} style={otherStyles} />;
      case 'shudder':
          otherStyles.transform = customWidth != "100%" ? "scale(0.9)" : "";
          return <Shudder className={chosenClass} style={otherStyles} />;
      default:
        return iconOnly ? <></> : <Typography className={chosenClass} style={otherStyles}>{name}</Typography>;
  }
};

const styles = (theme) => ({
  serviceLogo: {
      flex: "0 0 auto",
      fill: "white",
      overflow: "visible",
      position: "relative",

      height: "100%",
      width: "100%",
      "& path": {
          fill: "white"
      },
      "& ellipse": {
          fill: "white"
      },
      "& circle": {
          fill: "white"
      },
      [theme.breakpoints.down("xs")]: {
          width: "auto",
          height: "100%"
      }
  }
});

export default withStyles(styles)(ServiceIcon);
