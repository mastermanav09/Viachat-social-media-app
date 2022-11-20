import React, { useState, useEffect, useMemo } from "react";
import Like from "../svg/Like";
import { Link, useNavigate } from "react-router-dom";
import Comment from "../svg/Comment";
import { useDispatch, useSelector } from "react-redux";
import { format } from "timeago.js";
import classes from "./ScreamInfo.module.scss";
import { likeScream, unlikeScream } from "../../store/reducers/user";
import CommentsSection from "../comment/CommentsSection";
import linkValidation from "../../utils/linkValidation";

const ScreamInfo = (props) => {
  const dispatch = useDispatch();
  const scream = useSelector((state) => state.data.currentScreamData);
  const [likeCount, setLikeCount] = useState(scream.likeCount);
  const [initial, setIsInitial] = useState(true);

  const navigate = useNavigate();

  const userId = useSelector((state) => state.user.userId);
  const userTokenExpiry = useSelector((state) => state.user.tokenExpiryState);
  const [isLikedStatus, setIsLikedStatus] = useState(scream.likeStatus);
  const [disabled, setDisabled] = useState(false);
  const { socket } = props;

  useEffect(() => {
    if (userTokenExpiry * 1000 < Date.now()) {
      navigate("/login", { replace: true });
      return;
    }

    if (initial === true) {
      return;
    }

    setDisabled(true);

    const key1 = setTimeout(() => {
      if (isLikedStatus) {
        setLikeCount((prev) => prev + 1);
        dispatch(
          likeScream({
            userId: scream.userHandle,
            socket: socket,
            id: scream._id,
          })
        );
      } else {
        setLikeCount((prev) => prev - 1);
        dispatch(
          unlikeScream({
            userId: scream.userHandle,
            socket: socket,
            id: scream._id,
          })
        );
      }
    }, [100]);

    const key2 = setTimeout(() => {
      setDisabled(false);
    }, [300]);

    return () => {
      clearTimeout(key1);
      clearTimeout(key2);
    };
  }, [
    isLikedStatus,
    initial,
    dispatch,
    scream._id,
    scream.userHandle,
    socket,
    userTokenExpiry,
    navigate,
  ]);

  const likeScreamHandler = () => {
    if (isLikedStatus) {
      return;
    }

    setIsInitial(false);
    setIsLikedStatus(true);
  };

  const unlikeScreamHandler = () => {
    if (!isLikedStatus) {
      return;
    }

    setIsInitial(false);
    setIsLikedStatus(false);
  };

  return (
    <div className={classes["show-scream-box"]}>
      <div>
        <div className={classes["profile"]}>
          <img
            src={
              linkValidation(scream.userImageUrl)
                ? scream.userImageUrl
                : process.env.REACT_APP_ENDPOINT + "/" + scream.userImageUrl
            }
            alt="profile-pic"
            referrerPolicy="no-referrer"
          />
          <div className={classes["user-details"]}>
            {scream.userHandle === userId ? (
              <Link to={`/my-profile`}>
                <div>{scream.username}</div>
              </Link>
            ) : (
              <Link to={`/users/${scream.userHandle}`}>
                <div>{scream.username}</div>
              </Link>
            )}

            <div>{format(scream.createdAt)}</div>
          </div>
        </div>

        <div className={classes["scream-body"]}>{scream.body}</div>

        <div className={classes["actions-body"]}>
          <span>
            <button
              onClick={isLikedStatus ? unlikeScreamHandler : likeScreamHandler}
              disabled={disabled}
            >
              <Like isLikedStatus={isLikedStatus} />
            </button>
            <span className={classes.actions_text}>{likeCount} likes</span>
          </span>
          <span>
            <Comment />
            <span className={classes.actions_text}>
              {scream.commentCount} comments
            </span>
          </span>
        </div>
        <CommentsSection
          screamId={scream._id}
          screamUserId={scream.userHandle}
          socket={useMemo(() => socket, [socket])}
        />
      </div>
    </div>
  );
};

export default React.memo(ScreamInfo);
