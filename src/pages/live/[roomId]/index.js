import Head from "next/head";
import Sidebar from "components/Sidebar/Sidebar";
export default function LivePage() {
    return (
        <Sidebar room={null}>
            <Head>
                <title>Scener</title>
            </Head>
        </Sidebar>
    );
}
/*
export async function getServerSideProps(context) {
    const { getRoom, getParticipant, getParticipants } = require("lib/room");
    const { getUser } = require("lib/user");

    const { verifyAuthorizationCookie } = require("lib/auth");
    let currentUserId = null;
    try {
        let decoded = verifyAuthorizationCookie(context);
        if (decoded) {
            currentUserId = decoded.id;
        } else {
            currentUserId = null;
        }
    } catch (e) {
        console.log("Invalid or missing token");
        currentUserId = null;
    }
    try {
        let roomId = context.params.roomId;
        let room = await getRoom(roomId);
        let member = null;
        let owner = null;
        let participants = [];
        if (room) {
            if (currentUserId) {
                member = await getParticipant(roomId, currentUserId);
            }
            participants = await getParticipants(roomId);
            owner = await getUser(room.ownerId);
        }
        return {
            props: JSON.parse(JSON.stringify({ room: { ...room, member, participants, owner } }))
        };
    } catch (e) {
        console.error(e);
        return {
            props: {
                room: null
            }
        };
    }
}*/
