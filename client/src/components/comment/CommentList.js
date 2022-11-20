import React from "react";
import CommentItem from "./CommentItem";
import { useSelector } from "react-redux";
import classes from "./CommentList.module.scss";

const CommentList = (props) => {
  const comments = useSelector(
    (state) => state.data.currentScreamData.comments
  );

  return (
    <div className={classes["comment-list"]}>
      {comments.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            margin: "0.8rem 0",
            fontSize: "clamp(14px,3vw,16px)",
          }}
        >
          No comments
        </p>
      ) : (
        <>
          {comments.map((comment) => (
            <CommentItem
              comment={comment}
              key={comment._id}
              socket={props.socket}
              screamUserId={props.screamUserId}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default React.memo(CommentList);
