import classname from "classnames";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Popover, Dialog, IconButton, useMediaQuery, Box, Slide } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/CloseRounded";
import { forwardRef } from "react";
const useStyles = makeStyles((theme) => ({
    closeButtonRoot: {
        position: "absolute",
        right: 0,
        top: 0,
        zIndex: 10
    },
    headerLogo: {
        position: "absolute",
        left: "50%",
        top: "2rem",
        transform: "translateX(-50%)"
        //      marginTop: "1.5rem",
    },
    dialogPaperNoPadding: {
        padding: theme.spacing(0, 0, 0)
    },
    dialogPaper: {
        padding: theme.spacing(9, 0, 8)

        //    overflow: "visible"
    },
    dialogPaperGradient: {
        //    overflow: "visible",

        backgroundImage: theme.gradients.create("45", theme.palette.secondary.light, theme.palette.primary.dark)
    },
    dialogPaperNoLogo: {
        padding: theme.spacing(4, 0, 8)

        //  overflow: "visible"
    },
    dialogPaperGradientNoLogo: {
        background: theme.gradients.create("56.18", `${theme.palette.secondary.light} 0%`, `${theme.palette.primary.dark} 80%`)
    },
    popoverPaper: {
        borderRadius: 0,
        padding: theme.spacing(2, 0),
        minWidth: theme.functions.rems(350),
        maxWidth: theme.functions.rems(350)
    },
    popoverPaperGradient: {
        borderRadius: 0,
        padding: theme.spacing(2, 0),
        minWidth: theme.functions.rems(350),
        maxWidth: theme.functions.rems(350),
        backgroundImage: theme.gradients.create("45", theme.palette.secondary.light, theme.palette.primary.dark)
    }
}));
const Transition = forwardRef((props, ref) => <Slide ref={ref} {...props} />);

const NavPopup = ({
    classnames,
    children,
    anchorEl,
    open,
    onDismiss,
    dialog,
    hideLogo,
    gradient,
    paperStyle,
    dismissStyle,
    disableDismissPassing,
    disablePadding,
    hideDismiss,
    cursor = "below",
    fullScreen = true,
    direction = "up",
    veil = true,
    ...others
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("xs"));
    let transitionProps = {};
    if (isXs && fullScreen) {
        transitionProps = Object.assign({}, transitionProps, {
            TransitionComponent: Transition
        });
    }
    return dialog ? (
        <Dialog
            open={open}
            BackdropProps={{ style: { backgroundColor: veil ? "rgba(0,0,0,.8)" : "transparent" }}}
            disableBackdropClick={false}
            onClose={onDismiss}
            container={() => (typeof document !== "undefined" ? document.body : null)}
            maxWidth={"xs"}
            {...transitionProps}
            TransitionProps={{ direction }}
            fullScreen={(isXs && fullScreen) || false}
            classes={{
                paperWidthXs: classname({
                    [classes.dialogPaperGradient]: gradient && !hideLogo,
                    [classes.dialogPaperGradientNoLogo]: gradient && hideLogo,
                    [classes.dialogPaper]: !disablePadding && !gradient && !hideLogo,
                    [classes.dialogPaperNoLogo]: !disablePadding && !gradient && hideLogo,
                    [classes.dialogPaperNoPadding]: disablePadding
                }),
                ...classnames
            }}
            {...others}
        >
            {!hideDismiss && (
                <Box className={classname(classes.closeButtonRoot, dismissStyle)}>
                    <IconButton onClick={onDismiss}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            )}
            {/* {!hideLogo && (
                <div className={classes.headerLogo}>
                    <Scener style={{ height: "2.75rem", width: "2.75rem" }} />
                </div>
            )} */}
            {disableDismissPassing ? children : React.cloneElement(children, { onDismiss, dialog: true, hideDismiss })}
        </Dialog>
    ) : (
        <Popover
            anchorEl={anchorEl}
            transformOrigin={{ horizontal: "right", vertical: (cursor == "below" ? "top" : "bottom") }}
            anchorOrigin={{ horizontal: "right", vertical: (cursor == "below" ? "bottom" : "top") }}
            open={open}
            BackdropProps={{ style: { backgroundColor: veil ? "rgba(0,0,0,.8)" : "transparent" }}}
            disableBackdropClick={false}
            onClose={onDismiss}
            container={() => (typeof document !== "undefined" ? document.body : null)}
            PaperProps={{
                classes: {
                    root: classname({
                        [classes.popoverPaperGradient]: gradient,
                        [classes.popoverPaper]: !gradient
                    }),
                    ...classnames
                },
                style: paperStyle
            }}
            {...others}
        >
            {disableDismissPassing ? children : React.cloneElement(children, { onDismiss, popover: true })}
        </Popover>
    );
};

export default NavPopup;
