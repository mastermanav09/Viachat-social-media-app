import React, { useEffect, useState } from "react";
import classes from "./Home.module.scss";
// import axios from "axios";
// import Cookies from "universal-cookie";
// import LoadingSpinner from "../components/UI/LoadingSpinner";
import Screams from "../components/Screams";

const Home = () => {
  return (
    <div className={classes.container}>
      <div className={`${classes["left-sub-container"]}`}>
        <Screams />
      </div>
      <div className={`${classes["right-sub-container"]}`}>
        kilaLorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
        alias eum repellendus, aperiam sapiente cumque voluptatum accusantium
        consequatur maxime assumenda laboriosam mollitia saepe ea! Ex qui in
        sit. Fuga, reiciendis!
      </div>
    </div>
  );
};

export default Home;
