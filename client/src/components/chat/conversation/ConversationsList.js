import React, { useState } from "react";
import classes from "./ConversationList.module.scss";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../UI/LoadingSpinner";
import Conversation from "./Conversation";

const ConversationsList = (props) => {
  const userConversations = useSelector((state) => state.user.conversations);
  const onlineUsers = useSelector((state) => state.data.onlineUsers);
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
      content = userConversations.map((conversation) => {
        const receiverUser = conversation.members[0];
        const isOnline = onlineUsers.has(receiverUser.userId);

        return (
          <Conversation
            key={conversation._id}
            isOnline={isOnline}
            conversation={conversation}
            user={receiverUser}
            socket={socket}
          />
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
