import React, { useEffect, useState, useRef } from "react";
import { Popover, Typography, withStyles, Tooltip } from "@material-ui/core";
import * as localForage from "localforage";

const Coachmark = ({ modal, id, title, children, type, classes, timeout }) => {
    const [visible, setVisible] = useState(type == "tooltip" && id);
    const contentRef = useRef();
    const timeoutRef = useRef();

    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, []);

    useEffect(() => {
        if (id) {
            localForage.getItem("coachmark-" + id).then((cm) => {
                if (cm) {
                    setVisible(false);
                } else {
                    localForage.setItem("coachmark-" + id, true);
                    setVisible(true);
                }
            });
        }
    }, [id]);

    const setupTimeout = () => {
        if (timeout) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            setVisible(true);
            timeoutRef.current = setTimeout(() => {
                setVisible(false);
            }, timeout);
        }
    };

    useEffect(() => {
        //setupTimeout();
    }, []);

    // for tooltip type, revert to default tooltip functionality (dont show right awa)

    return type == "tooltip" ? (
        <div ref={contentRef} onMouseOver={setupTimeout} onMouseLeave={() => setVisible(false)} onClick={() => setVisible(false)}>
            {visible ? (
                <Tooltip arrow={true} open={visible} onClick={() => setVisible(false)} title={title}>
                    {children}
                </Tooltip>
            ) : (
                <>{children}</>
            )}
        </div>
    ) : (
        <>
            <div ref={contentRef}>{children}</div>
            <Popover
                style={modal && styles.modal}
                open={visible}
                onClick={() => setVisible(false)}
                anchorEl={contentRef && contentRef.current}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
            >
                <div
                    style={modal ? styles.mainModal : styles.main}
                    onClick={() => {
                        setVisible(false);
                    }}
                >
                    <div className={classes.mrow}>
                        <Typography variant={"body1"}>{title}</Typography>
                    </div>
                </div>
            </Popover>
        </>
    );
};

const styles = {
    modal: {
        backgroundColor: "rgba(0,0,0,0.7)"
    },
    main: {
        display: "flex",
        height: "auto",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    mainModal: {
        display: "flex",
        height: "auto",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    mrow: {
        backgroundColor: "rgba(180,50,255,0.8)",
        padding: 25,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        borderRadius: 15,
        marginTop: 20,
        "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "50%",
            width: 0,
            height: 0,
            border: "20px solid transparent",
            borderBottomColor: "rgba(180,50,255,0.8)",
            borderTop: 0,
            marginTop: -20,
            marginLeft: -20
        }
    }
};

export default withStyles(styles)(Coachmark);
