import React, { useEffect } from "react";
import classes from "./Home.module.scss";
import ScreamsList from "../components/scream/ScreamsList";
import Hero from "../components/profile/Hero";
import { NavLink, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { uiActions } from "../store/reducers/ui";
import Add from "../components/svg/Add";

const Home = (props) => {
  const dispatch = useDispatch();
  // useEffect(() => {
  //   localStorage.setItem("target", "/");
  // }, []);

  return (
    <>
      <Outlet />
      <div className={`${classes.container} `}>
        <div className={`${classes["left-sub-container"]}`}>
          <ScreamsList socket={props.socket} />
        </div>
        <div className={`${classes["right-sub-container"]}`}>
          <Hero />
        </div>
      </div>

      <NavLink
        to="/add-scream"
        onClick={() => dispatch(uiActions.showPostScreamModal())}
        className={classes["add-scream-mobile"]}
      >
        <li>
          <Add />
        </li>
      </NavLink>
    </>
  );
};

export default Home;
