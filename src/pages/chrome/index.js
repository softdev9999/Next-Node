import Head from "next/head";
import Page from "components/Page/Page";
import OpenGraph from "components/OpenGraph/OpenGraph";
import GetChromeCard from "components/SplitCard/GetChromeCard";
import withAppState from "components/Page/withAppState";
import { createOpenGraphTags } from "components/OpenGraph/OpenGraph";
function GetChromePage({ code }) {
    const getPageTitle = () => {
        return "Scener – Watch Netflix and more with friends";
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
                <GetChromeCard code={code} />
            </div>
        </Page>
    );
}

export function getServerSideProps(context) {
    return { props: { code: context.query.code || null } };
}

export default withAppState(GetChromePage);
