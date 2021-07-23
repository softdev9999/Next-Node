import React from "react";
import { useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useExtension } from "hooks/Extension/Extension";
import { Button } from "@material-ui/core";
import { useApp } from "hooks/Global/GlobalAppState";
import { addTracking } from "utils/Tracking";
const useStyles = makeStyles((theme_) => ({}));
import { useRouter } from "next/router";
import { isChrome, isMobile } from "utils/Browser";

const GetScenerButton = ({
    invert,
    classname,
    style,
    fullWidth,
    buttonRef,
    contentId,
    trackingSource = "Unknown",
    getTitle = "Get Scener",
    startTitle = "Host a watch party",
    defaultColor = "secondary",
    invertedColor = "default",
    defaultVariant = "contained",
    invertedVariant = "outlined"
}) => {
    const classes_ = useStyles();

    const { isExtensionInstalled } = useExtension();

    const {
        auth: { userId, user }
    } = useApp();

    const router = useRouter();

    return (
        <Button
            className={classname}
            style={style}
            fullWidth={fullWidth}
            buttonRef={buttonRef}
            variant={invert ? invertedVariant : defaultVariant}
            color={invert ? invertedColor : defaultColor}
            onClick={() => {

              let routeLoc = (isExtensionInstalled && userId) ? ("/host" + (contentId ? "?contentId=" + contentId : "")) : "/get";

              if (isMobile()) {
                  routeLoc = "/mobile";
              }
              else if (!isChrome()) {
                  routeLoc = "/chrome";
              }

              router.push(routeLoc, routeLoc);
            }}
            {...addTracking(trackingSource, "click", isExtensionInstalled ? startTitle : getTitle)}
        >
            {isExtensionInstalled != null ? (isExtensionInstalled ? startTitle : getTitle) : "\u00a0"}
        </Button>
    );
};

export default GetScenerButton;
