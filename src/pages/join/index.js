import Head from "next/head";
import Page from "components/Page/Page";
import JoinCard from "components/JoinCard/JoinCard";
import withAppState from "components/Page/withAppState";
import { createOpenGraphTags } from "components/OpenGraph/OpenGraph";
function EnterCodePage() {
    const getPageTitle = () => {
        return "Scener – Join the party";
    };

    //use roomCode if we want to load dynamic data
    return (
        <Page>
            <Head>
                <title>{getPageTitle()} </title>
                {createOpenGraphTags({ title: getPageTitle() })}

                {/* OG TAGS GO HERE*/}
            </Head>{" "}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <JoinCard />
            </div>
        </Page>
    );
}

export default withAppState(EnterCodePage);
