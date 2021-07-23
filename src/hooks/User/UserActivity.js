import useSWR, { mutate } from "swr";
import { request } from "utils/API";
const useUserActivity = (userId, refreshInterval = 15000) => {
    const { data, error } = useSWR([userId], (uid) => (uid ? request("/activity/" + uid) : Promise.resolve(null)), { refreshInterval });

    const refresh = (d, shouldRevalidate) => {
        console.log(userId, d, shouldRevalidate);
        userId ? (d ? mutate("/activity/" + userId, d, shouldRevalidate) : mutate("/activity/" + userId)) : null;
    };

    return { activity: data, error, refresh };
};

const UserActivity = ({ userId, children }) => {
    const { activity, error } = useUserActivity(userId);
    return children({ activity, error });
};

export { UserActivity, useUserActivity };
