import classname from "classnames";
import PropTypes from "prop-types";
import { makeStyles, IconButton, Typography, Grid, useMediaQuery, useTheme } from "@material-ui/core";
import TwitterIcon from "@material-ui/icons/Twitter";
import InstagramIcon from "@material-ui/icons/Instagram";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import EmailIcon from "@material-ui/icons/EmailOutlined";

const useStyles = makeStyles((theme) => ({
    container: {
        margin: theme.spacing(4, 0, 12),
        width: "100%",
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(2, 0, 8)
        },
        [theme.breakpoints.down("sm")]: {
            margin: theme.spacing(2, 0, 8)
        }
    },
    sticky: {
        position: "sticky",
        top: "calc(100% - 4rem)"
    },
    relative: {
        position: "relative",
        top: "auto"
    },
    primary: {
        fontSize: theme.functions.rems(18),
        letterSpacing: 1,
        lineHeight: theme.functions.rems(40)
    },
    socialContainer: {
        "& > a:first-child": {
            marginLeft: 0
        },
        "& > a:last-child": {
            marginRight: 0
        }
    },
    iconSize: {
        fontSize: theme.functions.rems(44),
        [theme.breakpoints.down('xs')]: {
            fontSize: theme.functions.rems(33)
        }
    },
    iconButton: {
        padding: 0,
        margin: theme.spacing(0, 1.5),
        "&:hover,&:focus,&:active": {
            background: "transparent"
        }
    }
}));

function Footer({ sticky }) {
    const classes = useStyles();
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        <div
            className={classname(classes.container, {
                [classes.sticky]: sticky,
                [classes.relative]: !sticky
            })}
        >
            <Grid
                container
                alignItems="center"
                justify={!isXs ? "space-between" : "center"}
                spacing={0}
                direction="row"
                wrap={!isXs ? "nowrap" : "wrap"}
            >
                <Grid item xs={12} sm={12} md={12}>
                    <Typography variant="h6" noWrap className={classes.primary} align={isXs ? "center" : "left"}>
                        Made with&nbsp;♥️&nbsp;&nbsp;in Seattle, WA
                    </Typography>
                </Grid>
                <Grid
                    container
                    alignItems="center"
                    justify={isXs ? "center" : "flex-end"}
                    direction="row"
                    wrap="nowrap"
                    className={classes.socialContainer}
                >
                    <IconButton disableRipple className={classes.iconButton} href="mailto:hello@scener.com" target="_blank">
                        <EmailIcon className={classes.iconSize} />
                    </IconButton>
                    <IconButton disableRipple className={classes.iconButton} href="https://www.twitter.com/scener" target="_blank">
                        <TwitterIcon className={classes.iconSize} />
                    </IconButton>
                    <IconButton disableRipple className={classes.iconButton} href="https://www.instagram.com/scener" target="_blank">
                        <InstagramIcon className={classes.iconSize} />
                    </IconButton>
                    <IconButton disableRipple className={classes.iconButton} href="https://www.linkedin.com/company/18797543/" target="_blank">
                        <LinkedInIcon className={classes.iconSize} />
                    </IconButton>
                </Grid>
            </Grid>
        </div>
    );
}

Footer.propTypes = {
    sticky: PropTypes.bool
};

Footer.defaultProps = {
    sticky: true
};

export default Footer;
