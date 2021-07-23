import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { makeStyles } from "@material-ui/core";
import Page from "components/Page/Page";
import OpenGraph from "components/OpenGraph/OpenGraph";
import useSWR from "swr";
import StartCard from "components/SplitCard/StartCard";
import withAppState from "components/Page/withAppState";
import { createOpenGraphTags } from "components/OpenGraph/OpenGraph";

const useStyles = makeStyles((theme) => ({
    container: {
        background: theme.palette.common.black
    }
}));

function JoinPage({ title, isRoom }) {
    const router = useRouter();
    const classes = useStyles();
    const { roomId } = router.query;
    const { data: room, error: roomError } = useSWR(() => "/rooms/" + roomId);
    const { data: owner, error: ownerError_ } = useSWR(() => "/users/" + room.ownerId);

    useEffect(() => {
        if (!isRoom) {
            router.replace("/[username]", "/" + roomId);
        }
    }, [isRoom]);
    //use roomCode if we want to load dynamic data
    return (
        <Page containerClassName={classes.container}>
            <Head>
                <title>{title} </title>
                {createOpenGraphTags({ title })}

                {/* OG TAGS GO HERE*/}
            </Head>
            {isRoom && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                    <StartCard showHomeButton={false} room={room} owner={owner} roomError={roomError} showCodeInput />
                </div>
            )}
        </Page>
    );
}

export async function getServerSideProps(context) {
    const { getRoom } = require("lib/room");
    const { getUser, userObject, getUserByName } = require("lib/user");
    let roomCode = context.params.roomId;
    // roomId to join
    // need to pull actual content info out of db and other users or whatever to statically render for seo purposes
    try {
        if (isNaN(roomCode)) {
            let room = await getRoom(roomCode);
            if (!room) {
                let user = await getUserByName(roomCode);
                if (user) {
                    return {
                        props: {
                            title: "Scener – Join @" + user.username + "",
                            isRoom: false
                        }
                    };
                } else {
                    return {
                        props: {
                            room: null,
                            owner: null,
                            isRoom: true
                        }
                    };
                }
            }
            let owner = null;
            if (room.ownerId) {
                owner = await getUser(room.ownerId);
                owner = userObject(owner, false).user;
            }
            let title = "Scener - Join";
            if (owner) {
                title = "Scener – Join @" + owner.username + "";
            }

            return {
                props: {
                    title,
                    isRoom: true
                }
            };
        } else {
            throw "invalid";
        }
    } catch (e) {
        return {
            props: {
                room: null,
                owner: null,
                isRoom: true
            }
        };
    }
}

export default withAppState(JoinPage);
