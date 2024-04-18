import React, { useEffect } from "react";
import classes from "./Home.module.scss";
import ScreamsList from "../components/scream/ScreamsList";
import Hero from "../components/profile/Hero";
import { NavLink, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { uiActions } from "../store/reducers/ui";
import Add from "../components/svg/Add";
import { useState } from "react";
import { debounce } from "../utils/debounceFn";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const Home = (props) => {
  const { handleScreamsLoading, screamsLoader } = props;
  const dispatch = useDispatch();
  const [errors, setErrors] = useState(null);
  const debouncedHandleScreams = debounce(handleScreamsLoading, 200);

  useEffect(() => {
    localStorage.setItem("target", "/");
    window.addEventListener("scroll", debouncedHandleScreams);

    return () => window.removeEventListener("scroll", debouncedHandleScreams);
  }, []);

  return (
    <>
      <Outlet />
      <div className={`${classes.container} `}>
        <div className={`${classes["left-sub-container"]}`}>
          <ScreamsList socket={props.socket} />
          {screamsLoader && (
            <div className={classes.spinner}>
              <LoadingSpinner />
            </div>
          )}
          {errors && (
            <h2 style={{ textAlign: "center", color: "red", margin: "auto" }}>
              {errors}
            </h2>
          )}
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
