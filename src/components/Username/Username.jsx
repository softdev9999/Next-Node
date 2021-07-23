import React from "react";
import NavLink from "../NavLink/NavLink";

const Username = ({ children, classname }) => {
    return (
        <NavLink href="/[username]" as={"/" + children}>
            <a className={classname} style={{ textDecoration: "none" }}> @{children}</a>
        </NavLink>
    );
};

export default Username;
