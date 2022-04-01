import React from "react";
import classes from "./Dropdown.scss";

const Dropdown = (props) => {
  return (
    <>
      <div className={classes["dropdown-menu"]}>
        {/* <button class="menu-btn">Open <</button> */}
        <div className={classes["menu-content"]} onClick={props.close}>
          <a className={classes.links} href="#">
            Contact Us
          </a>
          <a className={classes.links} href="#">
            Visit Us
          </a>
          <a className={classes.links} href="#">
            About Us
          </a>
        </div>
      </div>
    </>
  );
};
export default Dropdown;
