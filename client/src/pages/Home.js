import React from "react";
import classes from "./Home.module.scss";
import ScreamsList from "../components/ScreamsList";
import Hero from "../components/Hero";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <>
      <Outlet />
      <div className={classes.container}>
        <div className={`${classes["left-sub-container"]}`}>
          <ScreamsList />
        </div>
        <div className={`${classes["right-sub-container"]}`}>
          <Hero />
        </div>
      </div>
    </>
  );
};

export default Home;
