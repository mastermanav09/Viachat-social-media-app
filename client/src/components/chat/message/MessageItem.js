import React from "react";
import classes from "./MessageItem.module.scss";
import { format } from "timeago.js";

const MessageItem = (props) => {
  return (
    <div
      className={
        props.type === "sender" ? classes["sender"] : classes["receiver"]
      }
    >
      <div className={classes["text-block"]}>{props.text}</div>
      {props.messageNotSendError === props._id ? (
        <p className={classes["message-not-send-error"]}>Unable to send!</p>
      ) : (
        <p className={classes["timeago"]}>{format(props.timeAgo)}</p>
      )}
    </div>
  );
};

export default MessageItem;
