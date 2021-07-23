import "theme/global.scss";
import "theme/animations.scss";
import "react-image-crop/dist/ReactCrop.css";
//import "theme/fonts.scss";
import { useCallback, useEffect } from "react";
import ScenerThemeProvider from "theme/ScenerThemeProvider";
import { SWRConfig } from "swr";
import { request } from "utils/API";
import { CssBaseline } from "@material-ui/core";
import Head from "next/head";
import { useRouter } from "next/router";
import Cookies from "utils/Cookies";
import JwtDecode from "jwt-decode";
function ScenerApp({ Component, pageProps }) {
    const router = useRouter();
    useEffect(() => {
        if (typeof document !== "undefined") {
            const jssStyles = document.querySelector("#jss-server-side");
            if (jssStyles) {
                jssStyles.parentElement.removeChild(jssStyles);
            }
            checkQueryParams();
            const handleRouteChange = (url) => {
                ga("send", "pageview", url);
            };

            router.events.on("routeChangeComplete", handleRouteChange);

            // If the component is unmounted, unsubscribe
            // from the event with the `off` method:
            return () => {
                router.events.off("routeChangeComplete", handleRouteChange);
            };
        }
    }, []);

    const checkQueryParams = useCallback(() => {
        let params = new URL(document.location).searchParams;
        //check for utm tags
        try {
            let current = Cookies.get("scener_tags");
            if (!current) {
                current = {};
            }
            let changed = {};
            params.forEach((value, key) => {
                if (!current[key] && key.indexOf("utm_") == 0) {
                    current[key] = value;
                    changed[key] = value;
                }
            });
            Cookies.set("scener_tags", current);
            if (Object.keys(changed).length && Cookies.get("Auth-Token")) {
                let decoded = JwtDecode(Cookies.get("Auth-Token"));
                if (decoded && decoded.id) {
                    request("/users/" + decoded.id, {
                        method: "PUT",
                        body: {
                            tracking: changed
                        }
                    });
                }
            }
        } catch (e_) {
            //
        }
        try {
            let b64Email = params.get("u");
            if (b64Email) {
                let email = atob(b64Email);
                if (email) {
                    Cookies.set("email", email);
                }
            }
        } catch (e_) {
          // console.log(e_);
        }
    }, []);

    return (
        <SWRConfig
            value={{
                fetcher: request
            }}
        >
            <ScenerThemeProvider>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no" />
                    {process.env.STAGE == "beta" ? <meta name="robots" content="noindex" /> : null}
                </Head>
                <CssBaseline />

                <Component {...pageProps} />
            </ScenerThemeProvider>
        </SWRConfig>
    );
}

export default ScenerApp;
