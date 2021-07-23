import Head from "next/head";
import Page from "components/Page/Page";
import OpenGraph from "components/OpenGraph/OpenGraph";
import HostingPickerCard from "components/SplitCard/HostingPickerCard";

import { isChrome, isMobile } from "utils/Browser";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core";
import withAppState from "components/Page/withAppState";
import { createOpenGraphTags } from "components/OpenGraph/OpenGraph";
const useStyles = makeStyles((theme) => ({
    container: {
        backgroundColor: theme.palette.scener.eclipse
    },
    innerContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
    }
}));

function RoomTypePage() {
    const classes = useStyles();
    const router = useRouter();
    const getPageTitle = () => {
        return "Scener – Host a watch party";
    };
    const { contentId } = router.query;
    const mobile = useMemo(() => isMobile(), []);
    const onChrome = useMemo(() => isChrome(), []);
    //use roomCode if we want to load dynamic data
    useEffect(() => {
        if (mobile) {
            router.replace("/mobile");
        } else if (!onChrome) {
            router.replace("/chrome");
        }
    }, []);

    return (
        <Page containerClassName={classes.container}>
            <Head>
                <title>{getPageTitle()} </title>
                {createOpenGraphTags({ title: getPageTitle() })}

                {/* OG TAGS GO HERE*/}
            </Head>{" "}
            {!mobile && onChrome && (
                <div className={classes.innerContainer}>
                    <HostingPickerCard contentId={contentId} />
                </div>
            )}
        </Page>
    );
}

export default withAppState(RoomTypePage);
