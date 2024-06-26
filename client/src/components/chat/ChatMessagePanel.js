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
import { debounce } from "../../utils/debounceFn";
import { dataActions } from "../../store/reducers/data";

const ChatMessagePanel = (props) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.user.messages);
  const params = useParams();
  const userId = useSelector((state) => state.user.userId);
  const arrivalMessage = useSelector((state) => state.data.arrivalMessage);
  const conversationId = params.conversationId;
  const [conversation, setConversation] = useState(null);
  const currentConversation = useSelector(
    (state) => state.data.currentConversation
  );
  const [username, setUsername] = useState(null);
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
  }

  useEffect(() => {
    const toGetConversation = messages?.find(
      (message) => message.conversationId === conversationId
    );
    if (toGetConversation) {
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

    getMoreMessages();
  }, [conversationMessagePage, conversationId]);

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
        dispatch(
          dataActions.setConversationArrivalMessage({
            _id: data._id,
            sender: data.senderId,
            text: data.text,
            createdAt: Date.now(),
          })
        );
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

        dispatch(dataActions.setConversationArrivalMessage(null));
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
    scrollRef.current?.scrollIntoView({ block: "end" });
  }, [conversation]);

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
