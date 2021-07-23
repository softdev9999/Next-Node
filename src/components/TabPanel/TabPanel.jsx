import React from "react";
import { Box } from "@material-ui/core";

const TabPanel = ({ children, value, index, ...other }) => {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box p={3} style={{ height: "100%", display: "flex", alignItems: "stretch", flexFlow: "column nowrap", justifyContent: "center" }}>
                    {() => children}
                </Box>
            )}
        </div>
    );
};

export default TabPanel;
