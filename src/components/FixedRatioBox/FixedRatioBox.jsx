import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useCallback } from "react";
import { useBreakpoint } from "utils/Browser";
const useStyles = makeStyles(() => ({
    wrapper: {
        height: 0,
        paddingTop: "100%",
        position: "relative",
        width: "100%",
        display: "block"
    },
    wrapperNotFixed: {
        height: "auto",
        position: "relative",
        width: "100%",
        display: "block",
        minHeight: "100vh"
    },
    innerContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        height: "100%",
        width: "100%"
    }
}));

const FixedRatioBox = ({ children, xs, sm, md, lg, xl, innerProps, style, ...others }) => {
    if (typeof xs === "undefined") {
        xs = 1;
    }
    if (!sm) {
        sm = xs;
    }
    if (!md) {
        md = sm;
    }
    if (!lg) {
        lg = md;
    }
    if (!xl) {
        xl = lg;
    }
    const classes = useStyles();
    const breakpoint = useBreakpoint("only");
    const getPadding = useCallback(() => {
        if (breakpoint == "xl" && typeof xl !== "undefined") {
            return xl * 100 + "%";
        }
        if (breakpoint == "lg" && typeof lg !== "undefined") {
            return lg * 100 + "%";
        }
        if (breakpoint == "md" && typeof md !== "undefined") {
            return md * 100 + "%";
        }
        if (breakpoint == "sm" && typeof sm !== "undefined") {
            return sm * 100 + "%";
        }

        return xs * 100 + "%";
    }, [breakpoint, xs, sm, md, lg, xl]);
    const getClass = useCallback(() => {
        if (breakpoint == "xl" && xl) {
            return classes.wrapper;
        }
        if (breakpoint == "lg" && lg) {
            return classes.wrapper;
        }
        if (breakpoint == "md" && md) {
            return classes.wrapper;
        }
        if (breakpoint == "sm" && sm) {
            return classes.wrapper;
        }
        if (breakpoint == "xs" && xs) {
            return classes.wrapper;
        }
        return classes.wrapperNotFixed;
    }, [breakpoint, xs, sm, md, lg, xl]);

    return (
        <div
            {...others}
            className={getClass()}
            style={{
                paddingTop: getPadding(),
                ...style
            }}
        >
            <div className={classes.innerContainer} {...innerProps}>
                {children}
            </div>
        </div>
    );
};

export default FixedRatioBox;
