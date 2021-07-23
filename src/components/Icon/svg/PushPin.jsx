import React, { memo } from "react";
import { SvgIcon } from "@material-ui/core";

const PushPinIcon = (props) => (
    <SvgIcon {...props} viewBox="0 0 20 20">
        <path d="M14 8h-1V2a2 2 0 002-2H5a2 2 0 002 2v6H6a2 2 0 00-2 2v1h5v5l1 4 1-4v-5h5v-1a2 2 0 00-2-2z" />
    </SvgIcon>
);

export default memo(PushPinIcon);
