import React, { useEffect, useState } from "react";
import classes from "./Home.module.scss";
import ScreamsList from "../components/ScreamsList";
import Hero from "../components/Hero";
import Card from "../components/UI/Card";

const Home = () => {
  return (
    <div className={classes.container}>
      <div className={`${classes["left-sub-container"]}`}>
        <ScreamsList />
      </div>
      <div className={`${classes["right-sub-container"]}`}>
        {/* <Card type="profile" /> */}
        <Hero />
      </div>
    </div>
  );
};

export default Home;
