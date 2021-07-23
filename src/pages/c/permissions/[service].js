import Head from "next/head";
import PageWrapper from "components/Page/Page";
import { useRouter } from "next/router";

import { Container } from "@material-ui/core";
import ServicePermissions from "components/StartSteps/ServicePermissions";
import config from "../../../config";
import { useExtension } from "hooks/Extension/Extension";
import { useSettings } from "hooks/Settings/Settings";

import withAppState from "components/Page/withAppState";

function PermissionsPage({ query: { url, roomId, roomType } }) {
    const { country, loginSettingRequired, serviceSettingRequired } = useExtension();
    const settings = useSettings();
    const router = useRouter();

    const {
        query: { service }
    } = router;

    const navigateToService = (s) => {
        let hasSetting = s && settings.getItem("service." + s);
        let roomParams = roomId && roomType ? ("&roomId=" + roomId + "&roomType=" + roomType) : "";

        if (serviceSettingRequired(s)) {
          router.push("/c/service?setting=" + s + roomParams);
        } else if (loginSettingRequired(s)) {
          router.push("/c/service?login=" + s + roomParams);
        } else {

          if (url) {
              console.log("** CUSTOM URL ***", url);
              document.location.href = url;
          } else if (s && config.getServiceStart(s, country, hasSetting, {id: roomId, type: roomType})) {
              document.location.href = config.getServiceStart(s, country, hasSetting, {id: roomId, type: roomType});
          } else {
              //router.push("/c/loading");
              console.log("WTF?!", s, service, url);
          }
        }

    };

    return (
        <PageWrapper fullWidth={true} hideFooter={true} hideHeader={true}>
            <Head>
                <title>Scener – Permissions</title>
            </Head>
            <Container maxWidth={"md"} disableGutters style={{ padding: "3rem", width: "100vw", height: "100vh", display: "flex", alignItems: "center" }}>
                <ServicePermissions service={service} onAllowed={() => navigateToService(service)} />
            </Container>
        </PageWrapper>
    );
}
export default withAppState(PermissionsPage);

export function getServerSideProps(context) {
    return {
        props: { query: context.query }
    };
    //  }
}
