import UserListItem from "./UserListItem";
import { useEffect } from "react";
import { useState } from "react";
import { request } from "utils/API";
import { useRef } from "react";
import LazyList from "../LazyList/LazyList";

function UserList({ endpoint, pageSize, shouldLoad = true, noneLabel_, hideEmpty, embedded, infinite }) {
    const [users, setUsers] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const itemStatusMap = useRef({}).current;
    //  const [loadingPage, setLoadingPage] = useState(false);
    const isUserLoaded = (index) => !!itemStatusMap[index];
    const infinteLoaderRef = useRef();
    const loadMoreUsers = (startIndex, stopIndex) => {
        //console.log(startIndex, stopIndex, hasMore, endpoint);
        if (hasMore && endpoint) {
            //   setLoadingPage(true);
            return request(endpoint + "?cursor=" + parseInt(startIndex, 10) + "&count=" + (parseInt(stopIndex, 10) - parseInt(startIndex, 10)))
                .then(({ items }) => {
                    //  console.log(users, items, nextCursor, items.length == parseInt(stopIndex, 10) - parseInt(startIndex, 10));
                    if (items) {
                        items.forEach((i, index) => {
                            itemStatusMap[index + startIndex] = i;
                        });
                        setHasMore(true); //items.length == parseInt(stopIndex, 10) - parseInt(startIndex, 10));
                        updateUsers();
                        //     setLoadingPage(false);
                        return true;
                    } else {
                        setHasMore(false);
                        //   setLoadingPage(false);

                        return true;
                    }
                })
                .catch((e) => {
                    console.warn(endpoint, e);
                    //                    setLoadingPage(false);

                    return false;
                });
        } else {
            return Promise.resolve(true);
        }
    };

    const updateUsers = () => {
        setUsers(Object.values(itemStatusMap).filter((u) => !!u));
    };

    /* useEffect(() => {
     //   console.log({ hasMore });
    }, [hasMore]);*/

    useEffect(() => {
        if (shouldLoad && endpoint) {
            console.log("load users");
            if (infinteLoaderRef.current) {
                infinteLoaderRef.current.resetloadMoreItemsCache();
            }
            loadMoreUsers(0, pageSize);
        }
        return () => {
            if (infinteLoaderRef.current) {
                infinteLoaderRef.current.resetloadMoreItemsCache();
            }
            for (let i in itemStatusMap) {
                delete itemStatusMap[i];
            }
        };
    }, [shouldLoad, pageSize, endpoint]);

    return (
        <LazyList
            infinite={infinite}
            items={users}
            loadMoreItems={loadMoreUsers}
            itemHeight={76}
            hideEmpty={hideEmpty}
            renderItem={(item) => <UserListItem user={item} embedded={embedded} />}
            isItemLoaded={isUserLoaded}
            pageSize={pageSize}
            hasMore={hasMore}
            infinteLoaderRef={infinteLoaderRef}
        />
    );
}

export default UserList;
