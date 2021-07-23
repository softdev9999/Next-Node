import Head from "next/head";
import PageWrapper from "components/Page/Page";
import withAppState from "components/Page/withAppState";

import StartCard from "components/SplitCard/StartCard";

function StartPage({ query }) {
    return (
        <PageWrapper>
            <Head>
                <title>Scener – Host a watch party</title>
            </Head>
            <StartCard showHomeButton={true} contentId={query && query.cid} service={query && query.service} />
        </PageWrapper>
    );
}

export function getServerSideProps(context) {
    return { props: { query: context.query } };
}

export default withAppState(StartPage);
