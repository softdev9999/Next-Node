import { Container } from "@material-ui/core";
import withAppState from "components/Page/withAppState";
import dynamic from "next/dynamic";

const ActivityBar = dynamic(() => import("components/ActivityBar/ActivityBar"), { ssr: false });

function FeaturedPage({ query }) {
    return (
        <Container maxWidth="sm">
            <ActivityBar sections={["live", "popular"]} service={query.service} />
        </Container>
    );
}

export function getServerSideProps(context) {
    return { props: { query: context.query } };
}

export default withAppState(FeaturedPage);
