import classname from "classnames";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { withStyles, TextField, IconButton, Button, useTheme, Collapse } from "@material-ui/core";
import MessageView from "./MessageView";
import ArrowUpIcon from "@material-ui/icons/ArrowUpwardRounded";
import ChatHeader from "./ChatHeader";
import UserPopover from "./UserPopover";
import PinnedMessage from "./PinnedMessage";
import { isMobile } from "utils/Browser";
import { useApp } from "hooks/Global/GlobalAppState";
import { useCurrentRoom } from "hooks/Room/Room";
import { useExtension } from "hooks/Extension/Extension";

import ErrorView from "../../ErrorView/ErrorView";
import LoadingView from "../../Loading/LoadingView";
import dynamic from "next/dynamic";
import EmojiIcon from "@material-ui/icons/EmojiEmotions";
import ShareView from "../Room/ShareView";
import NavPopup from "../../NavPopup/NavPopup";
import { LoadingDots } from "../../Icon/Icon";


const AsyncEmojiPicker = dynamic(
    () => {
        return import("emoji-picker-react");
    },
    {
        ssr: false,
        loading: () => (
            <div style={{ minHeight: "320px", width: "100%", display: "flex", justifyContent: "center", alignContent: "center" }}>
                <LoadingDots style={{ width: "30%" }} />
            </div>
        )
    }
);

const ChatView = ({
    classes,

    onAuthRequired,
    onToggle,

    hidden
}) => {
    const [newMessage, setNewMessage] = useState("");
    const { sendMessage: sendExtMessage } = useExtension();

    const {
        auth: { userId, loggedIn },
        dimensions: { isLandscape }
    } = useApp();
    const theme = useTheme();
    const {
        room: {
            member: { role },
            pinnedMessage,
            ownerId
        },
        chat: { messages, connecting, error, chatChannel, sendMessage, memberCount, onAddGuestClick, onTokenExpired }
    } = useCurrentRoom();
    const messagesEndRef = useRef(null);
    const messageInputRef = useRef(null);
    const chatTextFocusTimer = useRef(null);

    // const tCheckTimer = useRef(null);
    const messagesContainerRef = useRef(null);

    const [showPicker, setShowPicker] = useState(false);

    // const [hasLoadedPicker, setHasLoadedPicker] = useState(false);
    const [scrollLock, setScrollLock] = useState(false);

    const [keyboardOpen, setKeyboardOpen] = useState(false);
    const [unread, setUnread] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);

    //    const [testMode, setTestMode] = useState(null);
    const [hideShareView, setHideShareView] = useState(memberCount > 1 || role != "owner");
    const send = () => {
        if (loggedIn) {
            if (newMessage) {
                ga("send", "Sent chat message");

                sendMessage(newMessage);
                setNewMessage("");
                setScrollLock(false);
                scrollToBottom(true);
            }
        } else {
            onAuthRequired();
        }
        setShowPicker(false);
    };

    const toggleChat = () => {
        onToggle(!hidden);
        setUnread(0);
        scrollToBottom();
    };

    const togglePicker = (ev) => {
        if (ev && ev.currentTarget) {
            setAnchorEl(ev.currentTarget);
        }

        if (loggedIn) {
            setShowPicker(!showPicker);
        } else {
            onAuthRequired();
        }
    };

    const moveCursorToEnd = () => {
        messageInputRef.current.focus();
        if (typeof messageInputRef.current.selectionStart == "number") {
            messageInputRef.current.selectionStart = messageInputRef.current.selectionEnd = messageInputRef.current.value.length;
        } else if (typeof messageInputRef.current.createTextRange != "undefined") {
            let range = messageInputRef.current.createTextRange();
            range.collapse(false);
            range.select();
        }
    };

    useEffect(() => {
        if (memberCount > 1) {
            setHideShareView(true);
        }
    }, [memberCount]);
    /*
    const sendRandomMessage = () => {
        //http://www.randomtext.me/api/lorem/p-1/3-10
        fetch("https://www.randomtext.me/api/gibberish/p-1/3-10")
            .then((response) => response.json())
            .then((data) => {
                if (data && data.text_out) {
                    let rMessage = data.text_out.replace(/(<p[^>]+?>|<p>|<\/p>)/gim, "");
                    sendMessage(rMessage);
                    scrollToBottom(true);
                }
            });
    };

    useEffect(() => {
        if (Cookies.get("testModeChat")) {
            tCheckTimer.current = setInterval(() => {
                sendMessage("abc123");
                scrollToBottom(true);
            }, 100);
        }

        return () => {
            clearInterval(tCheckTimer.current);
            tCheckTimer.current = null;
        };
    }, []);*/

    useEffect(() => {
        console.log("loggedIn? ", loggedIn);
    }, [loggedIn]);

    const onEmojiClick = (event, emojiObject) => {
        //setChosenEmoji(emojiObject);
        //console.log(emojiObject);
        if (emojiObject && emojiObject.emoji) {
            messageInputRef.current.focus();

            clearTimeout(chatTextFocusTimer.current);
            chatTextFocusTimer.current = setTimeout(() => {
                moveCursorToEnd();
            }, 200);

            let newMessageEmoji = messageInputRef.current.value + emojiObject.emoji;
            setNewMessage(newMessageEmoji);
        }
    };

    const scrollToBottom = (force) => {
        //messagesEndRef.current.scrollIntoView(false);
        requestAnimationFrame(() => {
            if (messagesContainerRef.current) {
                if (force || !scrollLock) {
                    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
                }

                if (force) {
                    setUnread(0);
                }
            }
        });
    };

    useEffect(() => {
        console.log(chatChannel);
        setTimeout(function () {
            scrollToBottom();
            isMobile() && window.scroll(1000, 0);
        }, 3000);
    }, []);

    const handleScroll = () => {
        if (messagesContainerRef.current) {
            let scrollOffset = Math.abs(
                messagesContainerRef.current.clientHeight + (messagesContainerRef.current.scrollTop - messagesContainerRef.current.scrollHeight)
            );
            let isScrollLock = scrollOffset > messagesContainerRef.current.clientHeight / 4;

            //console.log('** OFFSET ***', scrollOffset);
            if (!isScrollLock && !hidden) {
                setUnread(0);
            }
            setScrollLock(isScrollLock);
        }
    };

    useEffect(() => {
        if ((hidden || scrollLock) && messages && messages.length > 0) {
            setUnread(unread + 1);
        }
    }, [messages]);

    useLayoutEffect(() => {
        console.log(messages);
        setTimeout(function () {
            scrollToBottom();
        }, 350);
    }, [messages]);

    /*   const throwTwilsockError = () => {
        throw new Error("Can't connect to twilsock");
    };*/
    const [messageEl, setMessageEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const onMessageClick = (target, msg) => {
        console.log("m click", msg);
        if (msg.user && msg.user.id == "system" && msg.data) {
          if (msg.data.url) {
            if (msg.data.type == "popup") {
              //setShowPromoPopup(msg.data.url);
              sendExtMessage("openPopup", "background", { key: "promo", url: msg.data.url});
            } else {
              window.open(msg.data.url, "_blank");
            }
          }
        }
        else if (msg.user && userId != msg.user.id) {
            setSelectedUser(msg.user);
            setMessageEl(target);
        }
    };

    const renderChatContainer = () => {
        return (
            <>
                <div className={hidden ? classes.messageInnerContainerMin : classes.messageInnerContainer}>
                    <MessageView body="Welcome to chat!" userId="system" key={"welcome"} />
                    {!hidden &&
                        messages.map((m) => (
                            <MessageView
                                {...m}
                                showPin={m.userId == userId && role == "owner"}
                                key={m.id}
                                isLocalUser={m.userId == userId}
                                onClick={({ currentTarget }) => onMessageClick(currentTarget, m)}
                            />
                        ))}
                    {selectedUser && (
                        <UserPopover
                            user={selectedUser}
                            anchor={messageEl}
                            onDismiss={() => {
                                setMessageEl(null);
                                setSelectedUser(null);
                            }}
                        />
                    )}
                    <div className={classes.messageEnd} style={{ height: isMobile() && !keyboardOpen ? 100 : 0 }} ref={messagesEndRef} />
                </div>
                {!hidden && (
                    <div
                        className={classname({
                            [classes.inputContainer]: !isLandscape,
                            [classes.inputContainerLandscape]: isLandscape
                        })}
                    >
                        {unread && unread > 0 ? (
                            <Button
                                className={classes.unreadButton}
                                size="small"
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={() => scrollToBottom(true)}
                            >
                                {unread} New Message{unread > 1 ? "s" : ""}
                            </Button>
                        ) : null}
                        <TextField
                            onFocus={(e) => {
                                setShowPicker(false);
                                isMobile() && setKeyboardOpen(true);
                                if (!loggedIn) {
                                    onAuthRequired();
                                    e.target.blur();
                                }
                            }}
                            multiline={true}
                            inputRef={messageInputRef}
                            InputProps={{ disableUnderline: true }}
                            className={classes.chatInput}
                            onKeyPress={(ev) => {
                                //console.log(ev);
                                if (ev.key === "Enter") {
                                    if (!ev.shiftKey) {
                                        ev.preventDefault();
                                        send();
                                    }
                                }
                            }}
                            onBlur={() => {
                                if (isMobile()) {
                                    window.scroll(1000, 0);
                                    setKeyboardOpen(false);
                                    scrollToBottom();
                                }
                            }}
                            id="chat-input"
                            fullWidth
                            rowsMax={12}
                            value={newMessage}
                            autoComplete="off"
                            onChange={(e) => loggedIn && setNewMessage(e.currentTarget.value.substring(0, 300))}
                        />
                        <div className={classes.sendButtonWrapper}>
                            <IconButton
                                onClick={togglePicker}
                                style={{ marginRight: theme.functions.rems(5), color: "white" }}
                                color="primary"
                                size="small"
                            >
                                <EmojiIcon style={{ fontSize: theme.functions.rems(22) }} />
                            </IconButton>
                            <IconButton onClick={send} color="primary" size={"small"} disabled={!!error} style={{ color: "white" }}>
                                <ArrowUpIcon style={{ fontSize: theme.functions.rems(22) }} />
                            </IconButton>
                        </div>
                        <NavPopup
                            hideLogo
                            open={showPicker}
                            onDismiss={() => {
                                setShowPicker(false);
                                moveCursorToEnd();
                            }}
                            cursor={"above"}
                            veil={false}
                            anchorEl={anchorEl}
                            fullScreen={false}
                            disableDismissPassing
                        >
                            {showPicker && <AsyncEmojiPicker preload={false} onEmojiClick={onEmojiClick} />}
                        </NavPopup>
                    </div>
                )}
            </>
        );
    };

    return (
        <div
            className={classname({
                [classes.chatContainerMinLandscape]: isLandscape,
                [classes.chatContainer]: !isLandscape
            })}
            // className={hidden ? (isLandscape ? classes.chatContainerMinLandscape : classes.chatContainerMin) : classes.chatContainer}
        >
            <ChatHeader
                shareHidden={hideShareView}
                onHideShareView={setHideShareView}
                chatHidden={hidden}
                onChatHiddenToggle={toggleChat}
                unreadCount={unread}
                memberCount={memberCount}
                onAddGuestClick={onAddGuestClick}
            />
            <Collapse in={!hidden} classes={{container: classes.collapseContainer, wrapper: classes.collapseWrapper, wrapperInner: classes.collapseWrapperInner}}>
                {!hideShareView && !hidden && <ShareView isChatView className={classes.shareContainer} />}
                {pinnedMessage && !hidden && <PinnedMessage pinned={true} body={pinnedMessage} userId={ownerId} key="pinned" />}
                <div ref={messagesContainerRef} onScroll={handleScroll} className={classes.messageContainer}>
                    {error && !connecting && (
                        <ErrorView
                            message={"Could not connect to the chat server."}
                            resolveButtonTitle="TRY AGAIN"
                            onResolve={() => onTokenExpired()}
                        />
                    )}
                    {connecting && <LoadingView title="connecting..." />}
                    {!error && !connecting && renderChatContainer()}
                </div>
            </Collapse>
        </div>
    );
};

const styles = (theme) => ({
    chatContainer: {
        minHeight: "10vh",
        flex: "1 0 10vh",
        position: "relative",
        height: "100%",
        width: "100%",
        display: "flex",
        flexFlow: "column nowrap",
        zIndex: 10,
        alignItems: "center",
        justifyContent: "flex-start",
        //padding: theme.spacing(),
        backgroundColor: theme.palette.common.black
    },
    chatContainerMin: {
        flex: "0 1 100%",
        width: "100%",
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.common.black,
        position: "fixed",
        bottom: 0,
        minHeight: theme.functions.rems(50),
        zIndex: 10
    },
    chatContainerMinLandscape: {
        flex: "0 1 100%",
        height: "100%",
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.common.black,
        position: "sticky",
        right: 0,
        minWidth: theme.functions.rems(50),
        zIndex: 10
    },
    chatHeader: {
        width: "100%",
        height: theme.functions.rems(40),
        display: "flex",
        flexFlow: "row nowrap",
        margin: theme.spacing(0, -2),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        flex: "0 0 auto",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.palette.primary.dark
    },
    viewerCount: {
        alignItems: "center",
        justifyContent: "space-between",
        display: "flex",
        flex: "0 1 100%"
    },
    messageContainer: {
        height: "100%",
        flex: "1 1 100%",
        // maxHeight: "100%",
        overflowY: "scroll",
        //  backgroundColor: "red",
        position: "relative",
        width: "100%",
        transition: theme.transitions.create()
    },
    messageContainerMin: {
        height: "1px",
        flex: "0 0 0%",
        position: "relative",
        width: "100%",
        overflowY: "hidden",
        transition: theme.transitions.create()
    },
    messageInnerContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        height: "auto",
        width: "100%",
        padding: theme.spacing(3, 0, 10, 0),

        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        flexFlow: "column nowrap"
    },
    messageInnerContainerMin: {
        position: "absolute",
        top: 0,
        left: 0,
        height: "auto",
        width: "100%",
        padding: theme.spacing(0, 0, 0, 0),

        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        flexFlow: "column nowrap"
    },
    inputContainer: {
        //  backgroundColor: "blue",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        flex: "1 0 60px",
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "flex-end",
        // position: "fixed",
        //  bottom: 0,
        backgroundColor: theme.palette.primary.darkest,
        justifyContent: "space-between",
        padding: theme.spacing(2, 3)
    },
    inputContainerLandscape: {
        //  backgroundColor: "blue",
        position: "fixed",
        bottom: 0,
        left: "50%",
        right: 0,
        width: "50%",
        flex: "1 0 60px",
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "flex-end",
        // position: "fixed",
        //  bottom: 0,
        backgroundColor: theme.palette.primary.darkest,
        justifyContent: "space-between",
        padding: theme.spacing(2, 3)
    },
    inputWrapper: {
        flex: "0 1 100%"
    },
    chatInput: {
        backgroundColor: theme.palette.primary.dark,
        borderRadius: theme.functions.rems(20),
        paddingLeft: theme.functions.rems(20),
        height: "auto",
        minHeight: theme.functions.rems(36),
        paddingRight: theme.functions.rems(82),
        paddingTop: theme.functions.rems(3),
        borderColor: "transparent"
    },
    sendButtonWrapper: {
        height: theme.functions.rems(36),
        position: "absolute",
        width: theme.functions.rems(40),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        right: theme.functions.rems(40)
    },
    messageEnd: {
        position: "relative",
        bottom: 0,
        width: "100%",
        margin: "0.25rem 0",
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "flex-start",
        ustifyContent: "flex-start"
    },
    emojiPicker: {
        position: "absolute",
        right: "1rem",
        bottom: theme.functions.rems(60),
        transform: "translateY(0%)",
        width: "calc(40% + 8rem)",
        minWidth: theme.functions.rems(200),
        maxWidth: "90vw",
        transition: theme.transitions.create()
    },
    emojiPickerClosed: {
        position: "absolute",
        right: "1rem",
        bottom: theme.functions.rems(60),
        width: "calc(40% + 8rem)",
        minWidth: theme.functions.rems(200),
        maxWidth: "90vw",
        transition: theme.transitions.create(),
        transform: "translateY(200%)"
    },
    unreadButton: {
        margin: 0,
        position: "absolute",
        bottom: theme.functions.rems(60),
        left: 0,
        borderRadius: 0
    },
    shareContainer: {
        paddingTop: theme.functions.rems(24),
        paddingBottom: theme.functions.rems(24),
        background: theme.gradients.create(142.42, `${theme.palette.secondary.light} 0%`, `${theme.palette.primary.dark} 100%`)
    },
    collapseContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    collapseWrapper: {
        flex: 1,
    },
    collapseWrapperInner: {
        display: 'flex',
        flexDirection: 'column',
    }
});

export default withStyles(styles)(ChatView);
