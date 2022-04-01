import React from "react";
import classes from "./CommentItem.module.scss";
import { format } from "timeago.js";
import Delete from "./svg/Delete";
import { useDispatch } from "react-redux";
import { deleteComment } from "../store/reducers/data";

const CommentItem = (props) => {
  const { comment } = props;
  const dispatch = useDispatch();

  const deleteCommentHandler = () => {
    dispatch(
      deleteComment({
        commentId: comment._id,
        screamId: comment.screamId,
        userId: props.screamUserId,
        socket: props.socket,
      })
    );
  };

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

      <div className={classes["comment-actions"]}>
        <Delete onClick={deleteCommentHandler} />
      </div>
    </div>
  );
};

export default CommentItem;
