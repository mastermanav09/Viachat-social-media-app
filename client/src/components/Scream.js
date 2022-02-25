import React from "react";
import Card from "./UI/Card";
import classes from "./Scream.module.scss";
import Comment from "./svg/Comment";
import Like from "./svg/Like";
import { format } from "timeago.js";

const Scream = (props) => {
  const { scream } = props;

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
                <Like />
                <span className={classes.actions_text}>
                  {scream.likeCount} likes
                </span>
              </span>
              <span>
                <Comment />
                <span className={classes.actions_text}>
                  {scream.commentCount} comments
                </span>
              </span>
            </div>
            <div className={classes.actions_two}>
              <span>Op</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Scream;
