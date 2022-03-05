import React from "react";
import classes from "./NotificationItem.module.scss";

const NotificationItem = (props) => {
  const { notification } = props;
  return (
    <div className={`${classes["notification-item"]}`}>
      <div className={`${classes["image-container"]}`}>
        <img src="/images/no-img.png" alt="profile-icon" />
      </div>

      <div className={`${classes["lower-container"]}`}>
        <div className={`${classes["notification-user-info"]}`}>
          <div>
            Manav Naharwal <strong>liked your scream.</strong>
          </div>
          {/* <div style={{ margin: "0.1rem 0" }}>comment is this yes</div> */}
        </div>
        <div className={classes.timeago}>30 minutes ago</div>
      </div>
    </div>
  );
};

export default NotificationItem;
