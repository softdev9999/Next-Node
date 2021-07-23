import React from "react";
import config from "../../config";

const OpenGraph = ({
    description = config.OG.DESCRIPTION,
    title = config.OG.TITLE,
    image = config.OG.IMAGE,
    url = config.OG.URL,
    imageWidth = 1200,
    imageHeight = 630
}) => {
    return (
        <>
            <meta name="description" content={description} />
            <meta key={"twitter-site"} property="twitter:site" content="@scener" />
            <meta key="twitter-creator" property="twitter:creator" content="@scener" />
            <meta key="twitter-title" property="twitter:title" content={title} />
            <meta key="twitter-description" property="twitter:description" content={description} />
            <meta key="twitter-image" property="twitter:image" content={image} />
            <meta key="twitter-card" property="twitter:card" content="summary_large_image" />
            <meta key="og-url" property="og:url" content={url} />
            <meta key="og-type" property="og:type" content="image" />
            <meta key="og-title" property="og:title" content={title} />
            <meta key="og-description" property="og:description" content={description} />
            <meta key="og-image" property="og:image" content={image} />
            <meta key="og-image-type" property="og:image:type" content="image/jpeg" />
            <meta key="og-image-width" property="og:image:width" content={imageWidth} />
            <meta key="og-image-height" property="og:image:height" content={imageHeight} />
        </>
    );
};

const createOpenGraphTags = (props = {}) => {
    const defaultProps = {
        description: config.OG.DESCRIPTION,
        title: config.OG.TITLE,
        image: config.OG.IMAGE,
        url: config.OG.URL,
        imageWidth: 1200,
        imageHeight: 630
    };
    props = Object.assign(props, defaultProps);
    const { description, title, image, url, imageWidth, imageHeight } = props;
    return [
        <meta key="description" name="description" content={description} />,
        <meta key={"twitter-site"} property="twitter:site" content="@scener" />,
        <meta key="twitter-creator" property="twitter:creator" content="@scener" />,
        <meta key="twitter-title" property="twitter:title" content={title} />,
        <meta key="twitter-description" property="twitter:description" content={description} />,
        <meta key="twitter-image" property="twitter:image" content={image} />,
        <meta key="twitter-card" property="twitter:card" content="summary_large_image" />,
        <meta key="og-url" property="og:url" content={url} />,
        <meta key="og-type" property="og:type" content="image" />,
        <meta key="og-title" property="og:title" content={title} />,
        <meta key="og-description" property="og:description" content={description} />,
        <meta key="og-image" property="og:image" content={image} />,
        <meta key="og-image-type" property="og:image:type" content="image/jpeg" />,
        <meta key="og-image-width" property="og:image:width" content={imageWidth} />,
        <meta key="og-image-height" property="og:image:height" content={imageHeight} />
    ];
};

export { createOpenGraphTags };

export default OpenGraph;
