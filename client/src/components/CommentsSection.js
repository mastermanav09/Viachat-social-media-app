import React, { useState } from "react";
import CommentList from "./CommentList";
import classes from "./CommentSection.module.scss";

const CommentsSection = () => {
  const [bodyInput, setBodyInput] = useState("");
  const [error, setError] = useState(null);

  const addCommentHandler = () => {
    setError(null);
    if (bodyInput === "") {
      setError("Body cannot be empty!");
      return;
    }
  };

  return (
    <div className={classes["comment-section"]}>
      <div className={classes.header}>Comment Section</div>
      <div style={{ margin: "0.5rem 0" }}>
        <textarea
          rows={4}
          className={[
            classes["comment-area"],
            error ? classes.invalid : "",
          ].join(" ")}
          placeholder="Say Something..."
          onChange={(e) => {
            setError(null);
            setBodyInput(e.target.value);
          }}
          value={bodyInput}
        ></textarea>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            className={classes["add-comment-btn"]}
            onClick={addCommentHandler}
          >
            Add Comment
          </button>
          {error && <p className={classes["error-msg"]}>{error}</p>}
        </div>
      </div>
      <CommentList />
    </div>
  );
};

export default CommentsSection;
