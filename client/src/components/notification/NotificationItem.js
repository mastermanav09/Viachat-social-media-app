import React from "react";
import classes from "./NotificationItem.module.scss";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/reducers/ui";
import linkValidation from "../../utils/linkValidation";

const NotificationItem = (props) => {
  const { notification } = props;
  const username = useSelector((state) => state.user.credentials.username);
  const dispatch = useDispatch();

  return (
    <Link
      to={`/${username}/scream/${notification.screamId}`}
      onClick={() => {
        dispatch(uiActions.showScreamModal());
        dispatch(uiActions.clearBars());
      }}
      className={classes["notification-link"]}
    >
      <div className={`${classes["notification-item"]}`}>
        <div className={`${classes["image-container"]}`}>
          <img
            src={
              linkValidation(notification.userImageUrl)
                ? notification.userImageUrl
                : process.env.REACT_APP_ENDPOINT +
                  "/" +
                  notification.userImageUrl
            }
            alt="profile-icon"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className={`${classes["lower-container"]}`}>
          <div className={`${classes["notification-user-info"]}`}>
            <div>
              {notification.senderUsername}
              <strong>
                {notification.type === "Like" ? (
                  <> liked your scream.</>
                ) : (
                  <> commented on your scream.</>
                )}
              </strong>
            </div>
            {notification.type !== "Like" ? (
              <div style={{ margin: "0.1rem 0" }}>{notification.message}</div>
            ) : (
              <></>
            )}
          </div>
          <div className={classes.timeago}>
            {format(notification.createdAt)}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NotificationItem;
