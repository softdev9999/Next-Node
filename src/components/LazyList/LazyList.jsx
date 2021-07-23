import { makeStyles } from "@material-ui/core/styles";

import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { useMemo } from "react";
const useStyles = makeStyles((theme_) => ({
    list: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignContent: "center",
        alignItems: "stretch",
        overflowY: "visible"
    },
    typeWrap: {
        maxWidth: "60%",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden"
    },
    liveBadge: {
        "& span": {
            backgroundColor: "red !important"
        }
    }
}));

function LazyList({ items, renderItem, itemHeight = 76, loadMoreItems, isItemLoaded, pageSize, hideEmpty, infinite, infinteLoaderRef }) {
    const classes = useStyles();

    //  const [loadingPage, setLoadingPage] = useState(false);

    const shouldShow = useMemo(() => !!(!hideEmpty || (items && items.length)), [hideEmpty, items]);

    return shouldShow ? (
        infinite ? (
            <div className={classes.list} style={{ height: !infinite && "100%" }}>
                <div style={{ width: "100%", flex: infinite ? "1 1 100%" : "1 0 0%", height: !infinite && "100%" }}>
                    <AutoSizer disableWidth>
                        {({ height }) => {
                            return (
                                <InfiniteLoader
                                    isItemLoaded={isItemLoaded}
                                    itemCount={100000000}
                                    loadMoreItems={loadMoreItems}
                                    ref={infinteLoaderRef}
                                    minimumBatchSize={pageSize}
                                >
                                    {({ onItemsRendered, ref }) => (
                                        <FixedSizeList
                                            height={
                                                infinite
                                                    ? height
                                                    : (items.length > 0 && items.length < pageSize ? items.length : pageSize) * itemHeight
                                            }
                                            itemCount={items.length}
                                            itemSize={itemHeight}
                                            onItemsRendered={onItemsRendered}
                                            ref={ref}
                                            width={"100%"}
                                        >
                                            {({ index, style }) => (
                                                <div style={style} key={index}>
                                                    {renderItem(items[index])}
                                                </div>
                                            )}
                                        </FixedSizeList>
                                    )}
                                </InfiniteLoader>
                            );
                        }}
                    </AutoSizer>
                </div>
            </div>
        ) : (
            <div className={classes.list} style={{ height: "100%" }}>
                <div style={{ width: "100%", height: "100%" }}>
                    <FixedSizeList
                        height={Math.min(items.length, pageSize) * itemHeight}
                        itemCount={items.length}
                        itemSize={itemHeight}
                        width={"100%"}
                    >
                        {({ index, style }) => (
                            <div style={style} key={items[index] && items[index].id ? items[index].id : index}>
                                {renderItem(items[index])}
                            </div>
                        )}
                    </FixedSizeList>
                </div>
            </div>
        )
    ) : (
        <></>
    );
}

export default LazyList;
