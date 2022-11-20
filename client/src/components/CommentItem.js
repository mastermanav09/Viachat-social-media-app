import React from "react";
import classes from "./CommentItem.module.scss";
import { format } from "timeago.js";
import Delete from "./svg/Delete";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment } from "../store/reducers/data";
import { Link } from "react-router-dom";
import linkValidation from "../utils/linkValidation";

const CommentItem = (props) => {
  const { comment } = props;
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userId);

  const deleteCommentHandler = () => {
    if (props.comment.userHandle === userId || userId === props.screamUserId) {
      dispatch(
        deleteComment({
          commentId: comment._id,
          screamId: comment.screamId,
          userId: props.screamUserId,
          socket: props.socket,
          userHandle: props.comment.userHandle,
        })
      );
    }
  };

  return (
    <div className={`${classes["comment-item"]}`}>
      <div className={`${classes["image-container"]}`}>
        {comment.userImageUrl ? (
          <img
            src={
              linkValidation(comment.userImageUrl)
                ? comment.userImageUrl
                : process.env.REACT_APP_ENDPOINT + "/" + comment.userImageUrl
            }
            alt="profile-icon"
            referrerPolicy="no-referrer"
          />
        ) : (
          <img src="/images/no-img.png" alt="profile-icon" />
        )}
      </div>

      <div className={`${classes["lower-container"]}`}>
        <div className={`${classes["comment-user-info"]}`}>
          <Link to={`/users/${comment.userHandle}`}>{comment.username}</Link>
        </div>
        <div className={classes.timeago}>{format(comment.createdAt)}</div>
        <div className={classes["comment-body"]}>{comment.body}</div>
      </div>
      {props.comment.userHandle === userId || userId === props.screamUserId ? (
        <div className={classes["comment-actions"]}>
          <Delete onClick={deleteCommentHandler} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CommentItem;
