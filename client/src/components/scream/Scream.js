import React, { useState, useEffect } from "react";
import Card from "../UI/Card";
import classes from "./Scream.module.scss";
import Comment from "../svg/Comment";
import { Link } from "react-router-dom";
import Like from "../svg/Like";
import { format } from "timeago.js";
import { useDispatch, useSelector } from "react-redux";
import { likeScream, unlikeScream } from "../../store/reducers/user";
import Delete from "../svg/Delete";
import { deleteScream, getScream } from "../../store/reducers/data";
import Expand from "../svg/Expand";
import { PROFILE_SCREAM, RAND_USER_SCREAM } from "../../utils/constants";
import linkValidation from "../../utils/linkValidation";

const Scream = (props) => {
  const { scream } = props;
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.user.userId);
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
  }, [isLikedStatus, initial]);

  const deleteScreamHandler = () => {
    dispatch(deleteScream({ id: scream._id, socket: socket }));
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

  let updatedScreamBody;
  if (scream?.body?.length > 90) {
    updatedScreamBody = scream?.body.slice(0, 90);
    updatedScreamBody += "...";
  } else {
    updatedScreamBody = scream?.body;
  }

  return (
    <Card type={props.type}>
      <div className={classes.main}>
        <div className={`${classes["scream-profile-image"]}`}>
          {scream.userImageUrl ? (
            <img
              src={scream.userImageUrl}
              alt="profile-icon"
              referrerPolicy="no-referrer"
            />
          ) : (
            <img src="/images/no-img.png" alt="profile-icon" />
          )}
        </div>
        <div className={`${classes["scream-body"]}`}>
          <div className={classes["upper-body"]}>
            {userId === scream.userHandle ? (
              <Link to={`/my-profile`}>
                <div className={classes.name}>{scream.username}</div>
              </Link>
            ) : (
              <Link to={`/users/${scream.userHandle}`}>
                <div className={classes.name}>{scream.username}</div>
              </Link>
            )}
            <div className={classes.timeago}>{format(scream.createdAt)}</div>
            <div className={classes.body}>{updatedScreamBody}</div>
          </div>
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
                  to={
                    props.type === PROFILE_SCREAM
                      ? `/my-profile/scream/${scream._id}`
                      : `${props.type === RAND_USER_SCREAM ? `/users` : ``}/${
                          scream.userHandle
                        }/scream/${scream._id}`
                  }
                  onClick={() => {
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
            <div className={classes.show}>
              <Link
                to={
                  props.type === PROFILE_SCREAM
                    ? `/my-profile/scream/${scream._id}`
                    : `${props.type === RAND_USER_SCREAM ? `/users` : ``}/${
                        scream.userHandle
                      }/scream/${scream._id}`
                }
                style={{ cursor: "pointer" }}
              >
                <Expand />
              </Link>
            </div>
          </div>
        </div>
        <div className={`${classes["actions-two"]}`}>
          <div className={classes["show-mobile"]}>
            <Link
              to={
                props.type === PROFILE_SCREAM
                  ? `/my-profile/scream/${scream._id}`
                  : `${props.type === RAND_USER_SCREAM ? `/users` : ``}/${
                      scream.userHandle
                    }/scream/${scream._id}`
              }
              style={{ cursor: "pointer" }}
            >
              <Expand />
            </Link>
          </div>
          {scream.userHandle === userId ? (
            <div>
              <Delete onClick={deleteScreamHandler} />
            </div>
          ) : (
            <div className={classes["delete-placeholder"]}></div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default React.memo(Scream);
