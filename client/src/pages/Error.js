import React from "react";
import classes from "./Error.module.scss";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className={classes["error-body"]}>
      <div className={classes["not-found-cloud"]}></div>
      <div className={classes["not-found-text"]}>
        Oops! Something went wrong ☹
      </div>
      <Link to="/login">
        <button className={classes["home-btn"]}>Go to Home Page</button>
      </Link>
    </div>
  );
};

export default Error;
