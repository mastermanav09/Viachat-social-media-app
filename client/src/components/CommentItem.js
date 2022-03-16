import React from "react";
import classes from "./CommentItem.module.scss";
import { format } from "timeago.js";

const CommentItem = (props) => {
  const { comment } = props;

  return (
    <div className={`${classes["comment-item"]}`}>
      <div className={`${classes["image-container"]}`}>
        <img src="/images/no-img.png" alt="profile-icon" />
      </div>

      <div className={`${classes["lower-container"]}`}>
        <div className={`${classes["comment-user-info"]}`}>
          <div>{comment.username}</div>
        </div>
        <div className={classes.timeago}>{format(comment.createdAt)}</div>
        <div className={classes["comment-body"]}>{comment.body}</div>
      </div>
    </div>
  );
};

export default CommentItem;
