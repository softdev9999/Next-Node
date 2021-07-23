import { AppBar, makeStyles, Slide } from "@material-ui/core";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import MainNav from "../Nav/MainNav";
import HeaderRibbon from "./HeaderRibbon";


const useStyles = makeStyles((theme_) => ({
    header: {
        flex: "0 0 auto",
        width: "100%"
    },
    headerFixed: {
        zIndex: 1101
    },
    logo: {
        height: "100%",
        width: "3rem",
        backgroundImage: "url(/images/scener-logo-wordmark.png)",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center"
    },
    navBar: {}
}));


function Header() {
    const classes = useStyles();
    const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 132 });

    return (
        <>
            <AppBar position="static" color="transparent" className={classes.header} elevation={0}>
                <HeaderRibbon showOnCookieMatch="userId" title={"See what's new with Scener"} url="https://community.scener.com"/>
                <MainNav elevated={false && trigger} />
            </AppBar>
            <Slide in={trigger} timeout={100}>
                <AppBar position="fixed" color="primary" className={classes.headerFixed} variant="elevation">
                    <MainNav elevated />
                </AppBar>
            </Slide>
        </>
    );
}
export default Header;
