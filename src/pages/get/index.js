import Head from "next/head";
import Page from "components/Page/Page";
import GetExtensionCard from "components/SplitCard/GetExtensionCard";
import LoadingCard from "components/SplitCard/LoadingCard";
import withAppState from "components/Page/withAppState";
import { createOpenGraphTags } from "components/OpenGraph/OpenGraph";
import { useExtension } from "hooks/Extension/Extension";
import { useEffect, useMemo, useState } from "react";
import ReadyCard from "components/SplitCard/ReadyCard";
import { isChrome, isMobile } from "utils/Browser";
import { useRouter } from "next/router";
import { useApp } from "hooks/Global/GlobalAppState";
import CreateAccountCard from "components/SplitCard/CreateAccountCard";
import LoginCard from "components/SplitCard/LoginCard";
function GetPage() {
    //use roomCode if we want to load dynamic data
    const { isExtensionInstalled } = useExtension();
    const {
        auth: { loggedIn },
        popups: { account }
    } = useApp();
    const router = useRouter();
    const mobile = useMemo(() => isMobile(), []);
    const onChrome = useMemo(() => isChrome(), []);
    const [accountCard, setAccountCard] = useState("create");
    const card = useMemo(() => {
        if (isExtensionInstalled !== null) {
            if (isExtensionInstalled) {
                if (loggedIn) {
                    return <ReadyCard />;
                } else {
                    if (accountCard == "create") {
                        return <CreateAccountCard onFinished={() => {}} onLoginClicked={() => setAccountCard("login")} />;
                    } else {
                        return (
                            <LoginCard
                                onFinished={() => {}}
                                onSignupClicked={() => setAccountCard("create")}
                                onForgotPasswordClicked={() => account.show(true, { initialView: "forgot", singleView: true })}
                            />
                        );
                    }
                }
            } else if (mobile) {
                router.push("/mobile");
                return <LoadingCard />;
            } else if (!onChrome) {
                router.push("/chrome");
                return <LoadingCard />;
            } else {
                return <GetExtensionCard />;
            }
        } else {
            return <LoadingCard />;
        }
    }, [mobile, onChrome, isExtensionInstalled, loggedIn, accountCard]);

    return (
        <Page>
            <Head>
                <title>Scener – Watch Netflix and more with friends </title>
                {createOpenGraphTags()}
            </Head>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>{card}</div>
        </Page>
    );
}

export default withAppState(GetPage);
