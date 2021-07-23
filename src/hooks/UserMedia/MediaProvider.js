import React, { useContext } from "react";
import { useMediaSource } from "./useMediaSource";

const MediaContext = React.createContext({});

const MediaProvider = ({ children }) => {
    const mediaSource = useMediaSource();
    return <MediaContext.Provider value={mediaSource}>{children}</MediaContext.Provider>;
};
const useMedia = () => {
    return useContext(MediaContext);
};

export { MediaContext, MediaProvider, useMedia };
