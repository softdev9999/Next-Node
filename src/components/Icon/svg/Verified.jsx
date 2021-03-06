import React, { memo } from "react";
import { SvgIcon } from "@material-ui/core";

const VerifiedIcon = (props) => (
    <SvgIcon {...props} viewBox="0 0 50 48">
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <path
                d="M32.1107947,2.10254486 L36.0607544,8.77514244 L43.605537,10.4850297 L42.8947428,18.1817448 L47.9946738,24 L42.8947428,29.8182552 L43.605537,37.5149703 L36.0595641,39.2251273 L32.1091194,45.8776898 L25.0020219,42.8327389 L17.8925601,45.8995656 L13.9404359,39.2441749 L6.39478326,37.5340905 L7.10540215,29.8184206 L2.00687499,24.001767 L7.10554656,18.1640998 L6.39446285,10.4433829 L13.94163,8.75381418 L17.8908806,2.10326262 L25,5.14907981 L32.1107947,2.10254486 Z M32.7093971,18.3441973 L21.6693294,29.9080165 L17.290121,25.3169786 L16.5759156,26.0625178 L21.6697589,31.3938319 L33.4241323,19.0902895 L32.7093971,18.3441973 Z"
                stroke="#FFFFFF"
                strokeWidth="3"
                fill="#9013FE"
                fillRule="nonzero"
            ></path>
        </g>
    </SvgIcon>
);

export default memo(VerifiedIcon);
