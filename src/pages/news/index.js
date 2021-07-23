import Head from "next/head";
import Page from "components/Page/Page";
import withAppState from "components/Page/withAppState";
import { createOpenGraphTags } from "components/OpenGraph/OpenGraph";
function NewsPage() {
    const getPageTitle = () => {
        return "Scener – News";
    };

    //use roomCode if we want to load dynamic data
    return (
        <Page>
            <Head>
                <title>{getPageTitle()} </title>
                {createOpenGraphTags({ title: getPageTitle() })}

                {/* OG TAGS GO HERE*/}
            </Head>{" "}
        </Page>
    );
}

export default withAppState(NewsPage);
