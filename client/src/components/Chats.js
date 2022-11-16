import React from "react";
import classes from "./Chats.module.scss";
import { useSelector } from "react-redux";

import ConversationsList from "./ConversationsList";

const Chats = (props) => {
  const uiState = useSelector((state) => state.ui);
  const { socket } = props;

  return (
    <div
      className={[
        classes.chats,
        uiState.showChats ? classes["open"] : classes["close"],
      ].join(" ")}
    >
      <div className={classes["chats-wrapper"]}>
        <ConversationsList socket={socket} />
      </div>
    </div>
  );
};

export default Chats;
