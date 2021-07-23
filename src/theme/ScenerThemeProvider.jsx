import React from "react";

import ScenerTheme from "./ScenerThemeDefault";
import ScenerThemeSidebar from "./ScenerThemeSidebar";
import { ThemeProvider } from "@material-ui/core/styles";

const ScenerThemeProvider = ({ children, theme = "default" }) => {
    return (
        <ThemeProvider theme={theme == "sidebar" ? ScenerThemeSidebar : ScenerTheme}>
            {children}
        </ThemeProvider>
    );
};

export default ScenerThemeProvider;
