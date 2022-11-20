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
  const [isLoading, setIsLoading] = useState(false);
  const [messageNotSendError, setMessageNotSendError] = useState(null);
  const [bodyWidth, setBodyWidth] = useState(
    window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
  );

  const navigate = useNavigate();

  useEffect(() => {
    async function getMessagesHandler() {
      setError(null);

      const conversation = messages.find(
        (message) => message.conversationId === conversationId
      );

      if (conversation) {
        setConversation(conversation);
      } else {
        dispatch(getMessages({ conversationId, setIsLoading }));
      }
    }

    getMessagesHandler();
  }, [dispatch, conversationId, messages, conversation]);

  useEffect(() => {
    if (errors) {
      setError("Conversation not found!");
    }

    let username = "";

    if (currentConversation?.members[0].userId === userId) {
      username = currentConversation?.members[1].username;
    } else {
      username = currentConversation?.members[0].username;
    }

    setUsername(username);
  }, [errors, userId, currentConversation]);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        _id: data._id,
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, [socket]);

  useEffect(() => {
    if (arrivalMessage && currentConversation?.members) {
      for (let obj of currentConversation.members) {
        if (obj.userId === arrivalMessage.sender) {
          dispatch(
            userActions.addNewMessage({
              conversationId: currentConversation._id,
              message: arrivalMessage,
            })
          );
          return;
        }
      }
    }
  }, [arrivalMessage, dispatch]);

  const addNewMessageHandler = async (data, setInputText) => {
    let text = data;

    let receiverUserId;

    if (currentConversation?.members[0].userId === userId) {
      receiverUserId = currentConversation?.members[1].userId;
    } else {
      receiverUserId = currentConversation?.members[0].userId;
    }

    const newMessage = {
      conversationId: conversationId,
      sender: userId,
      receiver: receiverUserId,
      text,
    };

    setInputText("");
    dispatch(
      addNewMessage({ newMessage, socket: socket, setMessageNotSendError })
    );
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
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
        <div className={classes["chat-area"]}>
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
                src="/images/convo-not-found.png"
                alt="img"
              />
              <p className={classes["error-message"]}>{error}</p>
            </div>
          )}

          {!isLoading &&
            conversation &&
            conversation.messages.map((message) => (
              <div key={message._id} ref={scrollRef}>
                <MessageItem
                  _id={message._id}
                  type={message.sender === userId ? SENDER : RECEIVER}
                  text={message.text}
                  timeAgo={message.createdAt}
                  messageNotSendError={messageNotSendError}
                />
              </div>
            ))}
        </div>
        {!error && <MessageBox addNewMessageHandler={addNewMessageHandler} />}
      </div>
    </div>
  );
};

export default React.memo(ChatMessagePanel);
