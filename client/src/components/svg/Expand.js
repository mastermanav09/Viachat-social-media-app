import React from "react";
import classes from "./Expand.module.scss";

const Expand = (props) => {
  return (
    <svg
      className={classes.expand}
      version="1.1"
      id="Layer_1"
      x="0px"
      y="0px"
      viewBox="0 0 352.054 352.054"
      fill="#2666cf"
    >
      <g>
        <polygon points="144.206,186.634 30,300.84 30,238.059 0,238.059 0,352.054 113.995,352.054 113.995,322.054 51.212,322.054    165.419,207.847  " />
        <polygon points="238.059,0 238.059,30 300.84,30 186.633,144.208 207.846,165.42 322.054,51.213 322.054,113.995 352.054,113.995    352.054,0  " />
      </g>
    </svg>
  );
};

export default Expand;
