import React, { useEffect } from "react";
import classes from "./Notifications.module.scss";
import NotificationItem from "./NotificationItem";
import LoadingSpinner from "./UI/LoadingSpinner";
import { useSelector } from "react-redux";

const Notifications = () => {
  const userState = useSelector((state) => state.user);
  const uiState = useSelector((state) => state.ui);

  const { notifications } = userState;

  if (!notifications) {
    return (
      <div className={classes.notifications}>
        <div className={`${classes["notifications-wrapper"]}`}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  let content;
  if (uiState.errors) {
    if (uiState.errors.errorData) {
      content = uiState.errors.errorData[0].msg;
    } else {
      content = (
        <p
          style={{
            textAlign: "center",
            color: "red",
            margin: "0.8rem 0",
            fontSize: "clamp(14px,1.4vw,20px)",
          }}
        >
          Something went wrong!
        </p>
      );
    }
  } else {
    content =
      notifications.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            margin: "0.8rem 0",
            fontSize: "clamp(14px,1.4vw,20px)",
          }}
        >
          No notifications
        </p>
      ) : (
        notifications.map((notification) => (
          <NotificationItem notification={notification} />
        ))
      );
  }

  return (
    <div className={classes.notifications}>
      <div className={`${classes["notifications-wrapper"]}`}>{content}</div>
    </div>
  );
};

export default Notifications;
