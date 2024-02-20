import React from "react";
import classes from "./JumpingDot.module.scss";

const JumpingDot = () => {
  return (
    <div
      className={[
        classes["single-dot-container"],
        classes["rightDotContainer"],
      ].join(" ")}
    >
      <div className={classes["dot-base"]}></div>
      <div
        className={[classes["dot-highlight"], classes["right"]].join(" ")}
      ></div>
    </div>
  );
};

export default JumpingDot;
