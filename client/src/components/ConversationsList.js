import React from "react";
import { useState, useEffect } from "react";
import classes from "./Chats.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { CHATS_BAR_MOBILE } from "../utils/constants";
import Cross from "./svg/Cross";
import LoadingSpinner from "./UI/LoadingSpinner";
import Conversation from "./Conversation";
import { userActions } from "../store/reducers/user";

const ConversationsList = (props) => {
  const userConversations = useSelector((state) => state.user.conversations);
  const onlineUsers = useSelector((state) => state.data.onlineUsers);
  const userId = useSelector((state) => state.user.userId);
  const { socket } = props;

  let content = (
    <div className={classes["loader"]}>
      <LoadingSpinner />
    </div>
  );

  if (userConversations) {
    if (userConversations.length === 0) {
      content = (
        <div className={classes["no-chats-message"]}>
          <img
            src="/images/no-chats-icon.png"
            alt="no-chats-icon"
            referrerPolicy="no-referrer"
          />
          <span>No chats found</span>
        </div>
      );
    } else {
      content = userConversations
        .filter((conversation) => {
          const receiverUser = conversation.members.find(
            (obj) => obj.userId !== userId
          );

          if (
            conversation.recentMessage.length === 0 &&
            receiverUser.userId === userId
          ) {
            return false;
          }

          return true;
        })
        .map((conversation) => {
          const receiverUser = conversation.members.find(
            (obj) => obj.userId !== userId
          );
          const isOnline = onlineUsers.has(receiverUser.userId);

          return (
            <div key={conversation._id} className={classes["chat-link-item"]}>
              <Conversation
                isOnline={isOnline}
                conversation={conversation}
                user={receiverUser}
                socket={socket}
              />
            </div>
          );
        });
    }
  }

  if (!content) {
    content = (
      <div className={classes["no-chats-message"]}>
        <img src="/images/no-chats-icon.png" alt="no-chats-icon" />
        <span>No chats found</span>
      </div>
    );
  }

  return <>{content}</>;
};

export default ConversationsList;
