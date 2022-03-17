import React from "react";
import classes from "./Home.module.scss";
import ScreamsList from "../components/ScreamsList";
import Hero from "../components/Hero";
import { Outlet } from "react-router-dom";

const Home = (props) => {
  return (
    <>
      <Outlet />
      <div className={classes.container}>
        <div className={`${classes["left-sub-container"]}`}>
          <ScreamsList socket={props.socket} />
        </div>
        <div className={`${classes["right-sub-container"]}`}>
          <Hero />
        </div>
      </div>
    </>
  );
};

export default Home;
