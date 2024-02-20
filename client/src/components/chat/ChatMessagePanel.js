import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewMessage,
  getMessages,
  userActions,
} from "../../store/reducers/user";
import { RECEIVER, SENDER } from "../../utils/constants";
import classes from "./ChatMessagePanel.module.scss";
import MessageItem from "./message/MessageItem";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../UI/LoadingSpinner";
import MessageBox from "./message/MessageBox";
import { uiActions } from "../../store/reducers/ui";
import { debounce } from "../../utils/debounceFn";

let onceScroll = 2;
const ChatMessagePanel = (props) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.user.messages);
  const params = useParams();
  const userId = useSelector((state) => state.user.userId);
  const conversationId = params.conversationId;
  const [conversation, setConversation] = useState(null);
  const currentConversation = useSelector(
    (state) => state.data.currentConversation
  );
  const [username, setUsername] = useState(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [error, setError] = useState(null);
  const errors = useSelector((state) => state.ui.errors);
  const scrollRef = useRef();
  const { socket } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [messageNotSendError, setMessageNotSendError] = useState(null);
  const [bodyWidth, setBodyWidth] = useState(
    window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
  );
  const chatMainAreaRef = useRef();
  const navigate = useNavigate();
  const [conversationMessagePage, setConversationMessagePage] = useState([]);
  // this will hold the page value for each of the conversation messages.
  const totalResults = useSelector((state) => state.data.totalScreamsCount);
  const [mounted, setMounted] = useState(true);

  function handleMessages() {
    if (
      Math.abs(
        window.innerHeight +
          document.documentElement.scrollTop -
          document.documentElement.scrollHeight
      ) <= 100
    ) {
      // setScreamsLoader(true);
      // setPage((page) => page + 1);
    }
  }

  // useEffect(() => {
  // function getInfiniteScreams() {
  //   if (messages.length >= totalMessages) {
  //     setScreamsLoader(false);
  //     return;
  //   }
  // dispatch(getMessages({ conversationId, setIsLoading }));
  // }
  // getInfiniteScreams();
  // }, [dispatch, page]);

  // console.log("conversation", conversation);
  console.log("conversationMessagePage", conversationMessagePage);
  console.log("messages", messages, conversationId);

  function handleMessagesLoading() {
    if (chatMainAreaRef?.current?.scrollTop <= 400) {
      setConversationMessagePage((prev) => {
        const updatedOutput = [...prev];
        const _conversationIndex = updatedOutput.findIndex(
          (item) => item.conversationId === conversationId
        );

        const conversationFromMessages = messages.find(
          (message) => message.conversationId === conversationId
        );

        if (_conversationIndex === -1) {
          updatedOutput.push({
            conversationId,
            page: 2,
            totalMessagesLength: conversationFromMessages.totalMessagesLength,
          });
        } else {
          updatedOutput[_conversationIndex] = {
            ...updatedOutput[_conversationIndex],
            page: updatedOutput[_conversationIndex].page + 1,
          };
        }

        return updatedOutput;
      });
    }

    // dispatch(
    //   getMessages({
    //     conversationId,
    //     setIsLoading,
    //     conversationMessagePage,
    //     setConversationMessagePage,
    //   })
    // );
  }
  // console.log("Fetching more items");
  // setPage((page) => page + 1);
  // }

  useEffect(() => {
    const toGetConversation = messages?.find(
      (message) => message.conversationId === conversationId
    );
    if (toGetConversation) {
      // setIsLoading(true);
      setConversation(toGetConversation);
      setIsLoading(false);
    }
  }, [conversationId, messages]);

  useEffect(() => {
    setError(null);
    function getMoreMessages() {
      dispatch(
        getMessages({
          conversationId,
          conversationMessagePage,
          setConversationMessagePage,
          conversation,
          setIsLoading,
          setConversation,
          messages,
        })
      );
    }

    // if (mounted) {
    getMoreMessages();
    // }
  }, [conversationMessagePage, conversationId]);

  const throttledHandleScreams = () => {
    // cleint height === innerheight
  };
  // useEffect(() => {
  //   const chatMainAreaElement = chatMainAreaRef?.current;
  //   console.log(chatMainAreaElement);
  //   chatMainAreaElement.addEventListener("scroll", throttledHandleScreams);

  //   return () =>
  //     chatMainAreaElement.removeEventListener("scroll", throttledHandleScreams);
  // }, []);

  // console.log("chatMainAreaRef", chatMainAreaRef?.current?.clientHeight);
  // useEffect(() => {
  //   async function getMessagesHandler() {
  //     const conversation = messages.find(
  //       (message) => message.conversationId === conversationId
  //     );

  //     if (conversation) {
  //       setConversation(conversation);
  //     } else {
  //       dispatch(
  //         getMessages({
  //           conversationId,
  //           setIsLoading,
  //           conversationMessagePage,
  //           setConversationMessagePage,
  //         })
  //       );
  //     }
  //   }

  //   getMessagesHandler();
  // }, [dispatch, conversationId, messages, conversation]);

  useEffect(() => {
    if (errors) {
      setError("Conversation not found!");
    }

    const username = currentConversation?.members[0].username;
    setUsername(username);
  }, [errors, userId, currentConversation]);

  useEffect(() => {
    if (socket) {
      socket.on("getMessage", (data) => {
        setArrivalMessage({
          _id: data._id,
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        });
      });
    }
  }, [dispatch, socket]);

  useEffect(() => {
    if (arrivalMessage && currentConversation?.members) {
      if (currentConversation.members[0].userId === arrivalMessage.sender) {
        dispatch(
          userActions.addNewMessage({
            conversationId: currentConversation._id,
            message: arrivalMessage,
          })
        );
      }
    }
  }, [arrivalMessage, dispatch]);

  const addNewMessageHandler = async (data, setInputText) => {
    let text = data;

    const receiverUserId = currentConversation?.members[0].userId;

    const newMessage = {
      conversationId: conversationId,
      sender: userId,
      receiver: receiverUserId,
      text,
    };

    setInputText("");
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
    dispatch(addNewMessage({ newMessage, socket, setMessageNotSendError }));
  };

  useEffect(() => {
    // if (onceScroll) {
    scrollRef.current?.scrollIntoView({ block: "end" });
    // onceScroll--;
    // }
  }, [conversation]);

  // useEffect(() => {
  //   setMounted(false);
  // }, []);

  return (
    <div
      className={
        bodyWidth <= 480
          ? `${classes["chat-right-panel"]} ${classes["open"]}`
          : `${classes["chat-right-panel"]} ${classes["close"]}`
      }
    >
      <div className={classes["chat-header"]}>
        <button
          className={classes["back-btn"]}
          onClick={() => navigate("/my-profile/chats/")}
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            style={{ strokeWidth: "1.5" }}
            stroke="currentColor"
            className="w-5 h-[1.1rem]"
          >
            <path
              style={{ strokeLinecap: "round", strokeLinejoin: "round" }}
              d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
            />
          </svg>
        </button>
        <div className={classes["chat-username"]}>{username}</div>
      </div>
      <div className={classes["chat-main-area"]}>
        <div
          onScroll={debounce(handleMessagesLoading, 100)}
          ref={chatMainAreaRef}
          className={classes["chat-area"]}
        >
          {isLoading && !error && (
            <div className={classes["loader"]}>
              <LoadingSpinner />
            </div>
          )}
          {error && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0.5rem 0",
              }}
            >
              <img
                className={classes["error-message-img"]}
                src="/images/conversation-not-found.png"
                alt="img"
              />
              <p className={classes["error-message"]}>{error}</p>
            </div>
          )}

          {!isLoading &&
            conversation &&
            conversation.messages.map((message) => {
              return (
                <div key={message._id} ref={scrollRef}>
                  <MessageItem
                    _id={message._id}
                    type={message.sender === userId ? SENDER : RECEIVER}
                    text={message.text}
                    timeAgo={message.createdAt}
                    messageNotSendError={messageNotSendError}
                  />
                </div>
              );
            })}
        </div>
        {!error && <MessageBox addNewMessageHandler={addNewMessageHandler} />}
      </div>
    </div>
  );
};

export default React.memo(ChatMessagePanel);
