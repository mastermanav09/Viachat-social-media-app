import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutlet } from "react-router-dom";
import { uiActions } from "../../store/reducers/ui";
import classes from "./ChatPanel.module.scss";
import ConversationsList from "./conversation/ConversationsList";

const ChatPanel = (props) => {
  const dispatch = useDispatch();
  const userConversations = useSelector((state) => state.user.conversations);

  const Outlet = useOutlet();
  const { socket } = props;

  useEffect(() => {
    dispatch(uiActions.showChatPanel(true));
    return () => dispatch(uiActions.showChatPanel(false));
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("target", "/my-profile/chats");
  }, [dispatch]);

  return (
    <>
      <div className={classes["chat-panel"]}>
        <div className={classes["chat-left-panel"]}>
          <ConversationsList socket={socket} />
        </div>
        {Outlet || (
          <div className={classes["chat-placeholder"]}>
            <div>
              {userConversations?.length === 0 ? (
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
