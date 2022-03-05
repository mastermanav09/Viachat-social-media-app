import React, { useState, useEffect } from "react";
import Card from "./UI/Card";
import classes from "./Scream.module.scss";
import Comment from "./svg/Comment";
import Like from "./svg/Like";
import { format } from "timeago.js";
import { useDispatch, useSelector } from "react-redux";
import { likeScream, unlikeScream } from "../store/reducers/user";
import Delete from "./svg/Delete";

const Scream = (props) => {
  const { scream } = props;
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const [isLikedStatus, setIsLikedStatus] = useState(props.isLikedScream);
  const [initial, setIsInitial] = useState(true);
  const [likeCount, setLikeCount] = useState(scream.likeCount);

  useEffect(() => {
    setIsLikedStatus(props.isLikedScream);
  }, [props.isLikedScream]);

  useEffect(() => {
    if (initial === true) {
      return;
    }

    const key = setTimeout(() => {
      if (isLikedStatus) {
        setLikeCount((prev) => prev + 1);
        dispatch(likeScream(scream._id));
      } else {
        setLikeCount((prev) => prev - 1);
        dispatch(unlikeScream(scream._id));
      }
    }, [100]);

    return () => {
      clearTimeout(key);
    };
  }, [isLikedStatus, initial]);

  const deleteScreamHandler = (id) => {};

  const likeScreamHandler = () => {
    if (props.isLikedScream) {
      return;
    }

    setIsInitial(false);
    setIsLikedStatus(true);
  };

  const unlikeScreamHandler = () => {
    if (!props.isLikedScream) {
      return;
    }

    setIsInitial(false);
    setIsLikedStatus(false);
  };

  return (
    <Card type="scream">
      <div className={classes.main}>
        <div className={`${classes["scream-profile-image"]}`}>
          <img src="/images/no-img.png" alt="picture" />
        </div>
        <div className={`${classes["scream-body"]}`}>
          <div className={classes.name}>{scream.username}</div>
          <div className={classes.timeago}>{format(scream.createdAt)}</div>
          <div className={classes.body}>{scream.body}</div>
          <div className={classes.actions}>
            <div className={classes.actions_one}>
              <span>
                <Like
                  onClick={
                    props.isLikedScream
                      ? unlikeScreamHandler
                      : likeScreamHandler
                  }
                  isLikedStatus={isLikedStatus}
                />
                <span className={classes.actions_text}>{likeCount} likes</span>
              </span>
              <span>
                <Comment />
                <span className={classes.actions_text}>
                  {scream.commentCount} comments
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className={`${classes["actions-two"]}`}>
          {scream.userHandle === userState.userId && (
            <Delete onClick={deleteScreamHandler} />
          )}
          <span>Op</span>
        </div>
      </div>
    </Card>
  );
};

export default Scream;
