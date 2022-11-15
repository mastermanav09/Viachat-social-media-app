import React, { useState } from "react";
import classes from "./MessageBox.module.scss";

const MessageBox = (props) => {
  const [inputText, setInputText] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const textHandler = (event) => {
    setInputText(event.target.value);
    if (inputText) {
      setIsDisabled(false);
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.addNewMessageHandler(inputText, setInputText);
  };

  return (
    <div className={classes["message-box-container"]}>
      <form className={classes["message-box"]} onSubmit={submitHandler}>
        <textarea
          className={classes["message__textarea"]}
          rows="1"
          placeholder="Enter Your Message Here"
          onChange={textHandler}
          value={inputText}
        ></textarea>

        <div className={classes["submit"]}>
          <button
            type="submit"
            className={classes["submitbutton"]}
            disabled={inputText.trim().length === 0}
            style={{
              cursor: inputText.trim().length === 0 ? "default" : "pointer",
              padding: "0",
              margin: "0 0.5rem",
            }}
          >
            <svg aria-hidden="true" width="38" height="38" viewBox="0 0 24 24">
              <path
                fill="white"
                d="m16.707 11.293l-4-4a1.004 1.004 0 0 0-1.414 0l-4 4a1 1 0 0 0 1.414 1.414L11 10.414V16a1 1 0 0 0 2 0v-5.586l2.293 2.293a1 1 0 0 0 1.414-1.414Z"
              />
              <path
                fill={
                  inputText.trim().length > 0
                    ? "#2d55d8"
                    : "rgba(128, 128, 128, 0.763)"
                }
                d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm4.707 10.707a1 1 0 0 1-1.414 0L13 10.414V16a1 1 0 0 1-2 0v-5.586l-2.293 2.293a1 1 0 0 1-1.414-1.414l4-4a1.004 1.004 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414Z"
                opacity="1"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(MessageBox);
