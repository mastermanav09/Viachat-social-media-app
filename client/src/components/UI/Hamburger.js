import React from "react";
import classes from "./Hamburger.module.scss";

const Hamburger = (props) => {
  return (
    <div
      className={[
        classes["nav-icon"],
        props.showSidebarBtn ? classes["open"] : "",
      ].join(" ")}
    >
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default Hamburger;
