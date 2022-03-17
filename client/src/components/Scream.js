import React, { useState, useEffect } from "react";
import Card from "./UI/Card";
import classes from "./Scream.module.scss";
import Comment from "./svg/Comment";
import { Link } from "react-router-dom";
import Like from "./svg/Like";
import { format } from "timeago.js";
import { useDispatch, useSelector } from "react-redux";
import { likeScream, unlikeScream } from "../store/reducers/user";
import Delete from "./svg/Delete";
import { deleteScream, getScream } from "../store/reducers/data";
import Expand from "./svg/Expand";
import { uiActions } from "../store/reducers/ui";

const Scream = (props) => {
  const { scream } = props;
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const [isLikedStatus, setIsLikedStatus] = useState(props.isLikedScream);
  const [initial, setIsInitial] = useState(true);
  const [likeCount, setLikeCount] = useState(scream.likeCount);
  const { socket } = props;

  useEffect(() => {
    setLikeCount(scream.likeCount);
  }, [scream.likeCount]);

  useEffect(() => {
    setIsInitial(true);
    setIsLikedStatus(props.isLikedScream);
  }, [props.isLikedScream]);

  useEffect(() => {
    if (initial === true) {
      return;
    }

    const key = setTimeout(() => {
      if (isLikedStatus) {
        setLikeCount((prev) => prev + 1);
        dispatch(
          likeScream({
            socket: socket,
            id: scream._id,
            userId: scream.userHandle,
          })
        );
      } else {
        setLikeCount((prev) => prev - 1);
        dispatch(
          unlikeScream({
            socket: socket,
            id: scream._id,
            userId: scream.userHandle,
          })
        );
      }
    }, [100]);

    return () => {
      clearTimeout(key);
    };
  }, [isLikedStatus, initial]);

  const deleteScreamHandler = (id) => {
    dispatch(deleteScream({ id }));
  };

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
          <img src={scream.userImageUrl} alt="picture" />
        </div>
        <div className={`${classes["scream-body"]}`}>
          <Link to={`/users/${scream.username}?id=${scream.userHandle}`}>
            <div className={classes.name}>{scream.username}</div>
          </Link>
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
                <Link
                  to={`/${scream.username}/scream/${scream._id}`}
                  onClick={() => {
                    dispatch(uiActions.showScreamModal());
                    dispatch(
                      getScream({
                        id: scream._id,
                        likeStatus: props.isLikedScream,
                      })
                    );
                  }}
                >
                  <Comment />
                </Link>
                <span className={classes.actions_text}>
                  {scream.commentCount} comments
                </span>
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Link
                to={`/${scream.username}/scream/${scream._id}`}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  dispatch(uiActions.showScreamModal());
                  dispatch(
                    getScream({
                      id: scream._id,
                      likeStatus: props.isLikedScream,
                    })
                  );
                }}
              >
                <Expand />
              </Link>
            </div>
          </div>
        </div>
        <div className={`${classes["actions-two"]}`}>
          {scream.userHandle === userState.userId && (
            <Delete onClick={deleteScreamHandler} id={scream._id} />
          )}
        </div>
      </div>
    </Card>
  );
};

export default Scream;
