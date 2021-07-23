import { useRouter } from "next/router";
import PageWrapper from "components/Page/Page";
import Head from "next/head";
import OpenGraph from "components/OpenGraph/OpenGraph";
import { Container } from "@material-ui/core";
import Section from "components/Section/Section";
import ResetPassword from "components/AccountScreens/ResetPassword";
import withAppState from "components/Page/withAppState";
import { createOpenGraphTags } from "components/OpenGraph/OpenGraph";
function AccountResetPage() {
    const router = useRouter();

    return (
        <PageWrapper>
            <Head>
                <title>Scener – Reset Password</title>
                {createOpenGraphTags()}
            </Head>
            <Section>
                <Container maxWidth="sm">
                    <ResetPassword title="RESET PASSWORD" onCancel={() => router.back()} />
                </Container>
            </Section>
        </PageWrapper>
    );
}

export default withAppState(AccountResetPage);
