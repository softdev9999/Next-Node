import useSWR from "swr";

const useUser = (userId) => {
    const { data, error } = useSWR(() => "/users/" + userId, { dedupingInterval: 10000, focusThrottleInterval: 20000 });
    return { user: data, error };
};

const User = ({ userId, children }) => {
    const { user, error } = useUser(userId);
    return children({ user, error });
};

export { User, useUser };
