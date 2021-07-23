import React, { memo } from "react";
import { makeStyles, Accordion, AccordionSummary, AccordionDetails, Box, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: theme.spacing(1),
        background: theme.functions.rgba("#D8D8D8", 0.1),
        "&:before": {
            display: "none"
        },
        "&$expanded": {
            marginBottom: theme.spacing(1),
            "&:last-child": {
                marginTop: 0
            }
        }
    },
    accordionSummary: {
        paddingRight: 0,
        alignItems: "stretch",
        minHeight: theme.functions.rems(64)
    },
    accordionSummaryContent: {
        marginTop: theme.functions.rems(10),
        marginBottom: theme.functions.rems(10),
        alignItems: "center",
        "&$expanded": {
            marginTop: theme.functions.rems(10),
            marginBottom: theme.functions.rems(10)
        }
    },
    expandIcon: {
        borderRadius: 0,
        alignItems: "center",
        minWidth: theme.functions.rems(62),
        backgroundColor: theme.functions.rgba("#D8D8D8", 0.15),
        marginRight: 0,
        "&:hover,&:active,&:focus": {
            backgroundColor: theme.functions.rgba("#D8D8D8", 0.15)
        },
        "& > span > svg": {
            transition: "transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"
        },
        "&$expanded": {
            transform: "rotate(0deg)",
            "& > span > svg": {
                transform: "rotate(180deg)"
            }
        }
    },
    accordionDetails: {
        flexDirection: "column",
        padding: theme.spacing(0),
        backgroundColor: theme.functions.rgba(theme.palette.common.white, 0.05)
    },
    iconContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: theme.spacing(2.3),
        paddingRight: theme.spacing(2)
    },
    icon: {
        fontSize: theme.functions.rems(30)
    },
    accordionTitle: {
        fontSize: theme.functions.rems(14),
        fontWeight: 800,
        letterSpacing: 0.25,
        lineHeight: theme.functions.rems(18)
    },
    expanded: {}
}));

const ContentAccordion = ({ icon: IconComponent, expanded, title, children, onChange }) => {
    const classes = useStyles();
    return (
        <Accordion classes={{ root: classes.root, expanded: classes.expanded }} square elevation={0} expanded={expanded} onChange={onChange}>
            <AccordionSummary
                classes={{
                    root: classes.accordionSummary,
                    content: classes.accordionSummaryContent,
                    expandIcon: classes.expandIcon,
                    expanded: classes.expanded
                }}
                expandIcon={<ExpandMoreIcon />}
            >
                {IconComponent && (
                    <Box className={classes.iconContainer}>
                        <IconComponent className={classes.icon} />
                    </Box>
                )}
                <Typography component="h4" variant="h4" className={classes.accordionTitle}>
                    {title}
                </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetails}>{children}</AccordionDetails>
        </Accordion>
    );
};

ContentAccordion.propTypes = {
    expanded: PropTypes.bool,
    title: PropTypes.string,
    children: PropTypes.instanceOf(Object),
    onChange: PropTypes.func
};

ContentAccordion.defaultProps = {
    expanded: false,
    title: "",
    children: {},
    onChange: () => {}
};

export default memo(ContentAccordion);
