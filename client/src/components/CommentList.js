import React from "react";
import CommentItem from "./CommentItem";
import { useSelector } from "react-redux";

const CommentList = () => {
  const dataState = useSelector((state) => state.data);

  return (
    <div style={{ margin: "0.5rem 0", overflow: "auto" }}>
      {dataState.currentScreamData.comments.length == 0 ? (
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
          {dataState.currentScreamData.comments.map((comment) => (
            <CommentItem comment={comment} />
          ))}
        </>
      )}
    </div>
  );
};

export default CommentList;
