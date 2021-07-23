import React, { useMemo } from "react";
import { Avatar } from "@material-ui/core";
import NavLink from "../NavLink/NavLink";

const UserAvatar = ({ user, border = true, disableLink, style, ...others }) => {
    const defaultImageModifier = useMemo(() => {
        return user && user.id ? (parseInt(user.id, 10) % 3) + 1 : 1;
    }, [user]);

    return disableLink ? (
        <Avatar
            src={user && user.profileImageUrl ? user.profileImageUrl : "/images/profiledefault-" + (defaultImageModifier || 1) + ".jpg"}
            {...others}
            style={{ ...style, border: border ? ".125rem solid rgba(255,255,255,.3)" : null }}
        />
    ) : (
        <NavLink href="/[username]" as={"/" + (user && user.username)}>
            <a>
                <Avatar
                    src={user && user.profileImageUrl ? user.profileImageUrl : "/images/profiledefault-" + (defaultImageModifier || 1) + ".jpg"}
                    {...others}
                    style={{ ...style, border: border ? ".125rem solid rgba(255,255,255,.3)" : null }}
                />
            </a>
        </NavLink>
    );
};

export default UserAvatar;
