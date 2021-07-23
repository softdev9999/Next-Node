import ActivityBarSection from "./ActivityBarSection";
import LazyList from "../LazyList/LazyList";
import UserListItem from "../UserList/UserListItem";
import useSWR from "swr";
import { useRef, useState } from "react";
import { useEffect } from "react";
const RecommendedUsers = ({ embedded }) => {
    const {
        data: { items: users }
    } = useSWR("/users/featured?cursor=0&count=20", { initialData: { items: [] }, revalidateOnMount: true });
    const loadMoreUsers = () => {
        return Promise.resolve(true);
    };
    const infinteLoaderRef = useRef();
    const [visibleUsers, setVisibleUsers] = useState(users);
    useEffect(() => {
        if (users) {
            setVisibleUsers(users.filter((u) => u && u.username).slice(0, 5));
        }
    }, [users]);

    return visibleUsers.length ? (
        <ActivityBarSection title="Recommended hosts">
            <LazyList
                items={visibleUsers}
                isItemLoaded={(index) => !!visibleUsers[index]}
                pageSize={5}
                infinite={false}
                loadMoreItems={loadMoreUsers}
                hasMore={false}
                renderItem={(item) => <UserListItem user={item} embedded={embedded} />}
                itemHeight={76}
                infinteLoaderRef={infinteLoaderRef}
            />
        </ActivityBarSection>
    ) : null;
};

export default RecommendedUsers;
