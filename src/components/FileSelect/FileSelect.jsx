import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useRef } from "react";
import { Typography } from "@material-ui/core";
import { useState } from "react";
const useStyles = makeStyles((theme) => ({
    wrapper: {
        position: "relative",
        padding: theme.functions.rems(2),
        // border: "solid .125rem rgba(255,255,255,.6)"
        "&::after": {
            content: "''",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 0,
            borderRadius: (props) => (props.radius !== undefined && props.radius) || "100%",
            background: `linear-gradient(45deg, ${theme.palette.scener.supernova},  ${theme.palette.scener.gradientLight})`
        },
        "&:before": {
            content: "''",
            background: `gradient(linear, left top, right top, from(${theme.palette.scener.blackberry}), to(${theme.palette.scener.gradientDark}))`,
            backgroundClip: " padding-box",
            border: "solid 2px transparent",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 1,
            borderRadius: (props) => (props.radius !== undefined && props.radius) || "100%"
        }
    },
    input: {
        opacity: 0,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        zIndex: 5,
        width: "100%",
        height: "100%",
        cursor: "pointer"
    },
    inner: {
        pointerEvents: "none",
        zIndex: 1,
        position: "relative",
        cursor: "pointer",
        width: "100%",
        height: "100%"
    },
    overlay: {
        pointerEvents: "none",
        position: "absolute",
        opacity: 0,
        zIndex: 2,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        border: "dashed .125rem white",

        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "center",
        transition: theme.transitions.create()
    },
    hoveringOverlay: {
        position: "absolute",
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        opacity: 1,
        zIndex: 2,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: theme.functions.rgba(theme.palette.primary.main, 0.7),
        border: "dashed .125rem white",
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "center",
        transition: theme.transitions.create()
    }
}));

const FILE_TYPES = {
    jpeg: {
        mime: "image/jpeg",
        ext: /\.jpe?g$/
    },
    png: {
        mime: "image/png",
        ext: /\.png$/
    }
};

const FileSelect = ({
    children,
    onDataUrl,
    accept = null,
    fileSizeLimit = 5 * 1024 * 1024,
    onError,
    inputProps,
    round,
    title = "Select File",
    radius,
    width_,
    height,
    ...others
}) => {
    const classes = useStyles({ radius });
    const fileRef = useRef();
    const [hovering, setHovering] = useState(false);
    const onFileChange = ({ currentTarget }) => {
        if (currentTarget && currentTarget.files) {
            if (currentTarget.files[0]) {
                if (accept) {
                    let isAllowed = false;
                    accept.forEach((t) => {
                        if (FILE_TYPES[t].ext.test(currentTarget.files[0].name) || FILE_TYPES[t].mime == currentTarget.files[0].type) {
                            isAllowed = true;
                        }
                    });
                    if (!isAllowed) {
                        currentTarget.value = null;
                        onError("type");
                        return;
                    }
                }
                if (currentTarget.files[0].size > fileSizeLimit) {
                    onError("size");
                    currentTarget.value = null;
                    return;
                }
                onDataUrl(URL.createObjectURL(currentTarget.files[0]));
            }
        }
    };

    const getAcceptedTypes = () => {
        if (!accept) {
            return "*/*";
        }
        return accept
            .map((t) => {
                return FILE_TYPES[t] ? FILE_TYPES[t].mime : t;
            })
            .join(", ");
    };

    return (
        <div
            {...others}
            style={{ borderRadius: round ? "50%" : radius !== undefined ? radius : "1rem", height: height !== undefined && height }}
            className={classes.wrapper}
            onMouseOver={() => setHovering(true)}
            onMouseOut={() => setHovering(false)}
        >
            <div
                className={hovering ? classes.hoveringOverlay : classes.overlay}
                style={{ borderRadius: round ? "50%" : radius !== undefined ? radius : "1rem" }}
            >
                <Typography style={{ padding: "1rem" }} variant="h6" align="center">
                    {title}
                </Typography>
            </div>
            <div className={classes.inner}>{children}</div>
            <input
                {...inputProps}
                accept={getAcceptedTypes()}
                type="file"
                ref={fileRef}
                onChange={onFileChange}
                onError={onError}
                className={classes.input}
            />
        </div>
    );
};
export default FileSelect;
