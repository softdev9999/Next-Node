const { exec } = require("child_process");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
    openAnalyzer: false
});
const momentPlugin = require("moment-locales-webpack-plugin");
const withSourceMaps = require("@zeit/next-source-maps");
module.exports = withBundleAnalyzer(
    withSourceMaps({
        env: {
            STAGE: process.env.STAGE
        },
        compress: false,
        async redirects() {
            return [
                {
                  source: "/news",
                  destination: "https://community.scener.com",
                  permanent: false
                },
                {
                    source: "/installed",
                    destination: "/get",
                    permanent: false
                },
                {
                    source: "/start",
                    destination: "/get",
                    permanent: false
                },
                {
                    source: "/help/:slug*",
                    destination: "https://community.scener.com/:slug*",
                    permanent: false
                },
                {
                    source: "/community/:slug*",
                    destination: "https://community.scener.com/:slug*",
                    permanent: false
                },
                {
                    source: "/blog",
                    destination: "https://community.scener.com",
                    permanent: false
                }
            ];
        },
        generateBuildId: () => {
            let pkg = require("./package.json");
            return pkg.version;
        },
        webpack: (config, options) => {
            if (!options.isServer) {
                /* config.node = {
                    fs: "empty"
                };*/
            }

            config.plugins.push(
                new momentPlugin(),
                new options.webpack.NormalModuleReplacementPlugin(
                    /moment-timezone\/data\/packed\/latest\.json/,
                    require.resolve("./public/data/timezone-data.json")
                )
            );
            config.module.rules.push({
                test: /components\/.*\.svg/,
                use: [
                    options.defaultLoaders.babel,
                    {
                        loader: "react-svg-loader",
                        options: {
                            // path: "app/",
                            jsx: true, // true outputs JSX tags
                            svgo: {
                                plugins: [{ removeTitle: true, removeXMLNS: true, removeViewBox: false, removeDimensions: true }],
                                floatPrecision: 4
                            }
                        }
                    }
                ]
            });

            return config;
        }
    })
);
