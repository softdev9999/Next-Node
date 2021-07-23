import Head from "next/head";
import PageWrapper from "components/Page/Page";
import AVWizard from "components/StartSteps/AVWizard";

import { Container } from "@material-ui/core";
import { useMedia } from "hooks/UserMedia/MediaProvider";
import useBroadcastChannel from "hooks/useBroadcastChannel/useBroadcastChannel";
import withAppState from "components/Page/withAppState";

function CameraSetupPage() {
    const {
        mediaState: { videoEnabled, audioEnabled }
    } = useMedia();

    const { postMessage } = useBroadcastChannel({ name: "TheaterSetup" });

    const onFinished = () => {
        postMessage({
            name: "AVSetupFinished",
            mediaState: {
                audioEnabled,
                videoEnabled
            }
        });
    };

    return (
        <PageWrapper hideFooter={true} hideHeader={true}>
            <Head>
                <title>Scener – Camera Setup</title>
            </Head>
            <Container
                disableGutters
                style={{ padding: "3rem", width: "100vw", display: "flex", alignItems: "center" }}
                maxWidth={"md"}
            >
                <AVWizard onFinished={onFinished} finishedTitle="DONE" />;
            </Container>
        </PageWrapper>
    );
}
export default withAppState(CameraSetupPage);
export function getServerSideProps(context) {
    return {
        props: { query: context.query }
    };
}
