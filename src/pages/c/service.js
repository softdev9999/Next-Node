import Head from "next/head";
import { useState, useEffect } from "react";

import PageWrapper from "components/Page/Page";
import { useRouter } from "next/router";
import { getServiceNameFromUrl } from "utils/Browser";

import { Container } from "@material-ui/core";
import RoomServiceSelect from "components/StartSteps/RoomServiceSelect";
import config from "../../config";
import { useExtension } from "hooks/Extension/Extension";
import { useSettings } from "hooks/Settings/Settings";

import ExtLogin from "components/StartSteps/ExtLogin";
import useBroadcastChannel from "hooks/useBroadcastChannel/useBroadcastChannel";

import withAppState from "components/Page/withAppState";

function ServiceSelectPage() {
    const { country, servicePermissions, setServiceSetting, loginSettingRequired , checkServicePermissions} = useExtension();
    const settings = useSettings();
    const router = useRouter();

    const { postMessage } = useBroadcastChannel({ name: "TheaterSetup" });

    const [needLogin, setNeedLogin] = useState(null);
    const [serviceName, setServiceName] = useState("Select a Service");

    const {
        query: { setting, login, url, roomId, roomType }
    } = router;


    const onSettingChanged = (s, sett) => {
        if (s && sett) {
            postMessage({
                name: "ServiceSetting",
                service: s,
                setting: sett
            });
        }
    };

    const onLoginSettingChanged = (s) => {
          if (s) {
              postMessage({
                  name: "ServiceSetting",
                  service: s,
                  login: true
              });
          }
    };

    const onPermissionsNeeded = (s, gourl) => {
        // TODO: handle custom URL differently
        //console.log("NEED PERMS URL:", "/c/permissions/" + s + "?roomId=" + roomId + "&roomType=" + roomType + (gourl ? "&url=" + gourl : ""));
        router.push("/c/permissions/" + s + "?roomId=" + roomId + "&roomType=" + roomType + (gourl ? "&url=" + gourl : ""));
    };


    const onServiceSelected = (s) => {

      let gourl = null;
      let serv = s;

      if (s && s.indexOf("://") != -1) {
        serv = getServiceNameFromUrl(s);
        gourl = s;
      }

      checkServicePermissions(serv).then((allowed) => {
        if (allowed) {
          let hasSetting = serv && settings.getItem("service." + serv);

          if (loginSettingRequired(serv)) {
            setNeedLogin(serv);
          } else {
            if (gourl) {
                console.log("** CUSTOM URL ***", gourl);
                document.location.href = gourl;
            } else if (serv && config.getServiceStart(serv, country, hasSetting)) {
                document.location.href = config.getServiceStart(serv, country, hasSetting, {id: roomId, type: roomType});
            } else {
                // bad URL or service here
                //router.push("/c/[roomId]/[step]", "/c/" + roomId + "/finished", { shallow: true });
            }
          }

        } else {
          onPermissionsNeeded(serv, gourl);
        }
      });
    };

    const onSignin = async (s) => {
        let hasSetting = s && settings.getItem("service." + s);
        let settingToChange = (hasSetting ? hasSetting : s);

        setServiceSetting(settingToChange, null, true);
        onLoginSettingChanged(settingToChange);
        onServiceSelected(s);
    };

    useEffect(() => {
        if (login) {
          setNeedLogin(login);
        }

        if (setting && config.SERVICE_LIST[setting]) {
          setServiceName(config.SERVICE_LIST[setting].name);
        } else if (login && config.SERVICE_LIST[login]) {
          setServiceName(config.SERVICE_LIST[login].name);
        }
    }, [setting, login]);

    return (
        <PageWrapper fullWidth={true} hideFooter={true} hideHeader={true}>
            <Head>
                <title>Scener – {serviceName}</title>
            </Head>
            <Container maxWidth={needLogin ? "md" : false} disableGutters style={{ padding: "3rem", width: "100vw", height: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
              {needLogin ?
                  <ExtLogin service={needLogin} onReady={() => onSignin(needLogin)} />
                :
                  <RoomServiceSelect setting={setting} onSettingChanged={onSettingChanged} onServiceSelected={onServiceSelected} />
                }
            </Container>
        </PageWrapper>
    );
}
export default withAppState(ServiceSelectPage);
