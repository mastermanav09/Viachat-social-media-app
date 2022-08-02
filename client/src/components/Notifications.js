import React, { useEffect } from "react";
import classes from "./Notifications.module.scss";
import NotificationItem from "./NotificationItem";
import LoadingSpinner from "./UI/LoadingSpinner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cross from "./svg/Cross";

const Notifications = (props) => {
  const userTokenExpiry = useSelector((state) => state.user.tokenExpiryState);
  const uiState = useSelector((state) => state.ui);
  const notifications = useSelector((state) => state.user.notifications);
  const navigate = useNavigate();

  useEffect(() => {
    if (userTokenExpiry * 1000 < Date.now()) {
      navigate("/login", { replace: true });
    }
  }, []);

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
        <p className={classes["notification-text"]}>No notifications</p>
      ) : (
        notifications.map((notification) => (
          <NotificationItem
            notification={notification}
            key={notification._id}
          />
        ))
      );
  }

  return (
    <div
      className={[
        classes.notifications,
        uiState.showNotifications ? classes["open"] : classes["close"],
      ].join(" ")}
    >
      <div className={classes["close"]}>
        <Cross type="notification-bar-mobile" />
      </div>
      <div className={`${classes["notifications-wrapper"]}`}>{content}</div>
    </div>
  );
};

export default Notifications;
