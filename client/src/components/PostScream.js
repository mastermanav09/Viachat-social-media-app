import React, { useState, useEffect } from "react";
import classes from "./PostScream.module.scss";
import Modal from "./UI/Modal";
import { useDispatch, useSelector } from "react-redux";
import { postScream } from "../store/reducers/data";
import { useNavigate } from "react-router-dom";
import { uiActions } from "../store/reducers/ui";

const PostScream = () => {
  const [bodyInput, setBodyInput] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const uiState = useSelector((state) => state.ui);
  const navigate = useNavigate();

  const addScreamHandler = () => {
    setError(null);

    if (bodyInput === "") {
      setError("Body cannot be empty!");
      return;
    }

    dispatch(postScream({ bodyInput: bodyInput, navigate: navigate }));
  };

  useEffect(() => {
    if (uiState.errors) {
      if (uiState.errors.errorData[0].param === "body") {
        setError(uiState.errors.errorData[0].msg);
      }
    }

    dispatch(uiActions.showPostScreamModal());
  }, [uiState.errors, uiState.showPostScreamModal, dispatch]);

  console.log(uiState.showPostScreamModal);
  return (
    <Modal type="add-scream">
      <div className={`${classes["heading-add-scream"]}`}>
        Post a new scream
      </div>

      <div className={`${classes["add-scream-box"]}`}>
        <textarea
          className={[classes.textarea, error ? classes.invalid : ""].join(" ")}
          placeholder="Scream!!"
          name="add-scream-body"
          id="add-scream-body"
          onChange={(e) => {
            setError(null);
            setBodyInput(e.target.value);
          }}
          value={bodyInput}
        ></textarea>
        <div className={classes.actions}>
          <button onClick={addScreamHandler}>
            {uiState.loader ? (
              <div className={`${classes["dual-ring"]}`}></div>
            ) : (
              <>Add</>
            )}
          </button>
          {error && <p className={classes["error-msg"]}>{error}</p>}
        </div>
      </div>
    </Modal>
  );
};

export default PostScream;
