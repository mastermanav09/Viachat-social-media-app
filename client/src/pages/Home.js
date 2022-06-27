import React, { useEffect } from "react";
import classes from "./Home.module.scss";
import ScreamsList from "../components/ScreamsList";
import Hero from "../components/Hero";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Home = (props) => {
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("target", location.pathname);
  }, []);

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
    </>
  );
};

export default Home;
