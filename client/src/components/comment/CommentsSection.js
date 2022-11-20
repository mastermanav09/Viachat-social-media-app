import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../../store/reducers/data";
import CommentList from "./CommentList";
import classes from "./CommentSection.module.scss";

const CommentsSection = (props) => {
  const [bodyInput, setBodyInput] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const errors = useSelector((state) => state.ui.errors);
  const dispatch = useDispatch();

  const addCommentHandler = async () => {
    setError(null);

    if (bodyInput === "") {
      setError("Body cannot be empty!");
      return;
    }

    setIsLoading(true);

    await dispatch(
      addComment({
        body: bodyInput,
        screamId: props.screamId,
        userId: props.screamUserId,
        socket: props.socket,
      })
    );

    setBodyInput("");
    setIsLoading(false);

    if (errors && errors.errorData) {
      setError(errors.errorData[0].msg);
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
            {isLoading ? (
              <div className={`${classes["dual-ring"]}`}></div>
            ) : (
              <>Add Comment</>
            )}
          </button>
          {error && <p className={classes["error-msg"]}>{error}</p>}
        </div>
      </div>
      <CommentList socket={props.socket} screamUserId={props.screamUserId} />
    </div>
  );
};

export default React.memo(CommentsSection);
