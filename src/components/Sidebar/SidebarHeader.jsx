import {AppBar,  makeStyles } from "@material-ui/core";
import SidebarNav from "../Nav/SidebarNav";

const useStyles = makeStyles(() => ({
    header: {},
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
function SidebarHeader() {
    const classes = useStyles();
    return (
        <>
            <AppBar position="static" color="transparent" className={classes.header}>
                <SidebarNav />
            </AppBar>
        </>
    );
}
export default SidebarHeader;
