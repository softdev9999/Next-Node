import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheets } from "@material-ui/styles";
import ScenerThemeDefault from "theme/ScenerThemeDefault";
import { GA_TRACKING_ID } from "utils/Tracking";

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <meta charSet="utf-8" />

                    <meta
                        name="keywords"
                        content="netflix, hulu, streaming, netflix, snapchat, pluto, free, scener, app, co-watching, movies, shows, streaming, TV"
                    />
                    <meta name="google-site-verification" content="MuorYfD75n5gcPIr7dJtoeb_Ph7AXuRTIHVF43k72tA" />

                    <meta name="msapplication-TileColor" content="#ffffff" />
                    <meta name="msapplication-TileImage" content="/icons/ms-icon-144x144.png" />
                    <meta name="author" content="Scener" />

                    <meta name="theme-color" content={ScenerThemeDefault.palette.primary.main} />
                    <link rel="stylesheet" href="/fonts/fonts.css" />
                    <link rel="icon" href="/favicon.png" />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `!function(f,b,e,v,n,t,s)
                                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                                        n.queue=[];t=b.createElement(e);t.async=!0;
                                        t.src=v;s=b.getElementsByTagName(e)[0];
                                        s.parentNode.insertBefore(t,s)}(window,document,'script',
                                        'https://connect.facebook.net/en_US/fbevents.js');
                                        window._fbq = fbq;
                                        window._fbq('init', '2265830763736676'); 
                                        window._fbq('track', 'PageView');`
                        }}
                    />

                    <noscript>
                        <img height="1" width="1" src={"https://www.facebook.com/tr?id=2265830763736676&ev=PageView&noscript=1"} />
                    </noscript>

                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                                window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
                                ga('create', '${GA_TRACKING_ID}', 'auto');

                                // Replace the following lines with the plugins you want to use.
                                ga('require', 'eventTracker');
                                ga('require', 'urlChangeTracker');
                                ga('require', 'outboundLinkTracker');
                                ga('require', 'mediaQueryTracker');
                                ga('require', 'cleanUrlTracker');
                                // ...

                                ga('send', 'pageview');
                            `
                        }}
                    />
                    <script async src="https://www.google-analytics.com/analytics.js"></script>
                    <script async src="/js/autotrack.custom.js"></script>

                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                                !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
                                },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='//static.ads-twitter.com/uwt.js',
                                a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
                                // Insert Twitter Pixel ID and Standard Event data below
                                twq('init','o0hma');
                                twq('track','PageView');
                                window._twq = twq;`
                        }}
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                                (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
                                {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
                                a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
                                r.src=n;var u=t.getElementsByTagName(s)[0];
                                u.parentNode.insertBefore(r,u);})(window,document,
                                'https://sc-static.net/scevent.min.js');

                                snaptr('init', '7fcf879c-ba5a-4292-a2f1-8ec8f25eba6b');
                                snaptr('track', 'PAGE_VIEW');
                                window._snaptr = snaptr;`
                        }}
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                                    !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);
                                    rdt('init','t2_8v6cvkmp');
                                    rdt('track', 'PageVisit');
                                    window._rdt = rdt;`
                        }}
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

MyDocument.getInitialProps = async (ctx) => {
    // Render app and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) => (props) => sheets.collect(<App {...props} />)
        });

    const initialProps = await Document.getInitialProps(ctx);

    return {
        ...initialProps,
        // Styles fragment is rendered after the app and page rendering finish.
        styles: [
            <React.Fragment key="styles">
                {initialProps.styles}
                {sheets.getStyleElement()}
            </React.Fragment>
        ]
    };
};

export default MyDocument;
