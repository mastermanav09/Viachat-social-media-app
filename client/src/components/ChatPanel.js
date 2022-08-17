import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutlet } from "react-router-dom";
import { uiActions } from "../store/reducers/ui";
import { getConversations } from "../store/reducers/user";

import classes from "./ChatPanel.module.scss";
import Conversation from "./Conversation";
import LoadingSpinner from "./UI/LoadingSpinner";

const ChatPanel = () => {
  const dispatch = useDispatch();
  const userConversations = useSelector((state) => state.user.conversations);
  const userId = useSelector((state) => state.user.userId);
  const Outlet = useOutlet();

  useEffect(() => {
    dispatch(uiActions.showChatPanel(true));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  let content = (
    <div className={classes["loader"]}>
      <LoadingSpinner />
    </div>
  );

  if (userConversations) {
    if (userConversations.length !== 0) {
      content = userConversations.map((conversation) => {
        const user = conversation.members.find((obj) => obj.userId !== userId);

        return (
          <Conversation
            conversation={conversation}
            user={user}
            key={conversation._id}
            conversationId={conversation._id}
          />
        );
      });
    } else {
      content = <p className={classes["no-chats-message"]}>No chats found</p>;
    }
  }

  return (
    <>
      <div className={classes["chat-panel"]}>
        <div className={classes["chat-left-panel"]}>{content}</div>
        {Outlet || (
          <div className={classes["chat-placeholder"]}>
            <div>
              {userConversations && userConversations.length === 0 ? (
                <p>No chats found!</p>
              ) : (
                <p>Open a conversation to start a chat!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatPanel;
