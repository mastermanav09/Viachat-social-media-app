import React from "react";
import "./Dropdown.css";

const Dropdown = (props) => {
  return (
    <>
      <div className="dropdown-menu">
        {/* <button class="menu-btn">Open <</button> */}
        <div className="menu-content" onClick={props.close}>
          <a className="links" href="#">
            Contact Us
          </a>
          <a className="links" href="#">
            Visit Us
          </a>
          <a className="links" href="#">
            About Us
          </a>
        </div>
      </div>
    </>
  );
};
export default Dropdown;
