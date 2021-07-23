import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PageWrapper from "components/Page/Page";
import Head from "next/head";
import OpenGraph from "components/OpenGraph/OpenGraph";
import { Container, Grid, Typography, CircularProgress } from "@material-ui/core";
import Section from "components/Section/Section";
import { checkResetLink } from "utils/API";
import ResetPassword from "components/AccountScreens/ResetPassword";
import withAppState from "components/Page/withAppState";
import { createOpenGraphTags } from "components/OpenGraph/OpenGraph";

function AccountForgotPage({ reset }) {
    const [error, setError] = useState(null);
    const [resetUser, setResetUser] = useState(null);
    const router = useRouter();
    useEffect(() => {
        if (reset) {
            checkResetLink({ reset })
                .then((userReset) => {
                    if (userReset && userReset.id) {
                        setResetUser(userReset);
                    } else {
                        setError("Invalid or expired reset link");
                    }
                })
                .catch(() => {
                    setError("Invalid or expired reset link");
                });
        }
    }, [reset]);

    return (
        <PageWrapper>
            <Head>
                <title>Scener – Forgot Password</title>
                {createOpenGraphTags({ title: "Scener – Forgot Password" })}
            </Head>
            <Section>
                <Container maxWidth="sm">
                    <>
                        <Grid item xs={12}>
                            <Typography align="center" variant="h3">
                                {!resetUser || resetUser.username ? "RESET PASSWORD" : "COMPLETE ACCOUNT"}
                            </Typography>
                        </Grid>
                        {resetUser ? (
                            <ResetPassword
                                user={resetUser}
                                reset={reset}
                                onFinished={(newUser) => router.push("/[username]", "/" + newUser.username)}
                            />
                        ) : error ? (
                            <Typography color="secondary" align="center" variant="h4">
                                {error}
                            </Typography>
                        ) : (
                            <CircularProgress size={"8rem"} />
                        )}
                    </>
                </Container>
            </Section>
        </PageWrapper>
    );
}

export function getServerSideProps({ query }) {
    if (query && query.reset) {
        return {
            props: {
                reset: query.reset
            }
        };
    } else {
        return {
            props: {
                reset: null
            }
        };
    }
}
export default withAppState(AccountForgotPage);
