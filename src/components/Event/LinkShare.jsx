import React, { useState, useRef } from "react";
import { withStyles, Typography, Button } from "@material-ui/core";
import LinkIcon from "@material-ui/icons/Link";
import CheckMarkIcon from "@material-ui/icons/CheckRounded";

import ScenerThemeDefault from "theme/ScenerThemeDefault";
import { useCurrentRoom } from "hooks/Room/Room";

const LinkShare = ({ url, title, onFinished, classes }) => {

    const copyRef = useRef();

    const [hasCopied, setHasCopied] = useState(null);
    //const [shareUrl, setShareUrl] = useState(null);

    const copyClipboard = (el) => {
        if (process.browser) {
            ga("Copied Event Link");

            el.focus();
            el.select();
            document.execCommand("copy");
            setHasCopied(true);
            setTimeout(function () {
                if (el) {
                    setHasCopied(false);
                }
            }, 1500);
        }
    };

    const postToFacebook = (link) => {
      let shareLink = "https://www.facebook.com/dialog/share?app_id=542101952898971&display=popup&href=" + encodeURIComponent(link);
      window.open(shareLink, "_blank");
      //setShareUrl(link);
    };

    const postToTwitter = (link) => {
      let shareLink = "https://twitter.com/intent/tweet?url=" + encodeURIComponent(link);
      window.open(shareLink, "_blank");
    };

    return (
        <div className={classes.shareContainer} >
            <div>
                <Typography variant={"body1"} align="center" paragraph className={classes.paragraph}>
                    {title ? title : "Share"}
                </Typography>
            </div>
            <Button
                variant={"contained"}
                color="secondary"
                className={classes.button}
                onClick={() => copyClipboard(copyRef.current)}
                style={{ backgroundColor: hasCopied && ScenerThemeDefault.palette.success.main, marginBottom: "1rem" }}
                endIcon={!hasCopied ? <LinkIcon style={{ color: "currentColor" }} /> : <CheckMarkIcon style={{ color: "currentColor" }} />}
            >
                {!hasCopied ? "copy link" : "copied!"}
            </Button>
            <Button
                variant={"contained"}
                color="secondary"
                className={classes.button}
                onClick={() => postToFacebook(url)}
            >
                Facebook
            </Button>
            <Button
                variant={"contained"}
                color="secondary"
                className={classes.button}
                onClick={() => postToTwitter(url)}
            >
                Twitter
            </Button>


            <textarea ref={copyRef} readOnly={true} style={{ position: "absolute", left: -9999 }} value={url} />
        </div>
    );
};

const styles = (theme) => ({
    shareContainer: {
        width: "100%",
        minHeight: "10rem",
        flexFlow: "column nowrap",
        padding: theme.spacing(2, 3),
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        borderRadius: theme.functions.rems(4)
        //  backgroundColor: theme.palette.primary.light
        //  border: "2px " + theme.palette.primary.main + " solid"
    },
    errorBubble: {
        position: "relative",
        left: 0,
        right: 0,
        width: "100%",
        backgroundColor: "rgba(255,0,0,0.2)",
        padding: "1rem"
    },
    paragraph: {
        marginBottom: theme.spacing(1.3)
    },
    button: {
        color: theme.palette.common.white,
        width: theme.spacing(35),
        marginBottom: theme.spacing(1),
        boxShadow: "none",
        height: theme.spacing(4.3),
        "&:hover,&:focus,&:active": {
            boxShadow: "none"
        }
    }
});

export default withStyles(styles)(LinkShare);
