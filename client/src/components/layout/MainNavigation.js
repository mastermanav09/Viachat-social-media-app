import React, { useState } from "react";
import classes from "./MainNavigation.module.scss";
import { Link, NavLink } from "react-router-dom";

const MainNavigation = () => {
  const [isAuthLogin, setIsAuthLogin] = useState(true);

  const authLoginHandler = () => setIsAuthLogin((prev) => !prev);

  return (
    <nav
      className={`${classes.navbar} ${classes["navbar-dark"]} ${classes["bg-blue"]}`}
    >
      <Link to="/" style={{ textDecoration: "none" }}>
        <div className={`${classes["main-head"]}`}>
          <img src="/Viachat.png" className={classes.logo} alt="logo" />
          <h2 className={`${classes["nav-brand"]}`}>
            <span className={`${classes["pre-heading"]}`}>Via</span>chat
          </h2>
        </div>
      </Link>

      <div className={`${classes["navbar-mid-nav"]}`}>
        <ul className={`${classes["nav-mid-list"]}`}>
          <NavLink to="/">
            <li>
              <svg viewBox="0 0 28 28" height="28" width="28">
                <path d="M25.825 12.29C25.824 12.289 25.823 12.288 25.821 12.286L15.027 2.937C14.752 2.675 14.392 2.527 13.989 2.521 13.608 2.527 13.248 2.675 13.001 2.912L2.175 12.29C1.756 12.658 1.629 13.245 1.868 13.759 2.079 14.215 2.567 14.479 3.069 14.479L5 14.479 5 23.729C5 24.695 5.784 25.479 6.75 25.479L11 25.479C11.552 25.479 12 25.031 12 24.479L12 18.309C12 18.126 12.148 17.979 12.33 17.979L15.67 17.979C15.852 17.979 16 18.126 16 18.309L16 24.479C16 25.031 16.448 25.479 17 25.479L21.25 25.479C22.217 25.479 23 24.695 23 23.729L23 14.479 24.931 14.479C25.433 14.479 25.921 14.215 26.132 13.759 26.371 13.245 26.244 12.658 25.825 12.29"></path>
              </svg>
            </li>
          </NavLink>

          <li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              width="28"
              height="28"
              viewBox="0 0 256 256"
              className="add-scream-icon"
            >
              <g transform="translate(128 128) scale(0.72 0.72)">
                <g transform="translate(-175.05 -175.05000000000004) scale(3.89 3.89)">
                  <path
                    d="M 45 90 c -4.418 0 -8 -3.582 -8 -8 V 8 c 0 -4.418 3.582 -8 8 -8 c 4.418 0 8 3.582 8 8 v 74 C 53 86.418 49.418 90 45 90 z"
                    transform=" matrix(1 0 0 1 0 0) "
                    style={{ strokeLineup: "round" }}
                  />
                  <path
                    d="M 82 53 H 8 c -4.418 0 -8 -3.582 -8 -8 c 0 -4.418 3.582 -8 8 -8 h 74 c 4.418 0 8 3.582 8 8 C 90 49.418 86.418 53 82 53 z"
                    transform=" matrix(1 0 0 1 0 0) "
                    style={{ strokeLineup: "round" }}
                  />
                </g>
              </g>
            </svg>
          </li>
        </ul>
      </div>

      <div className={`${classes["navbar-nav"]}`}>
        <ul className={`${classes["nav-list"]}`}>
          <Link to="/my-profile">
            <li>
              <div className={`${classes["profile-icon"]}`}>
                <img
                  src="/images/no-img.png"
                  className="profile-img"
                  alt="picture"
                />
                <span>Manav</span>
              </div>
            </li>
          </Link>
          <li>
            <div className={`${classes["navbar-actions-icon"]}`}>
              <svg viewBox="0 0 28 28" alt="" height="24" width="24">
                <path d="M7.847 23.488C9.207 23.488 11.443 23.363 14.467 22.806 13.944 24.228 12.581 25.247 10.98 25.247 9.649 25.247 8.483 24.542 7.825 23.488L7.847 23.488ZM24.923 15.73C25.17 17.002 24.278 18.127 22.27 19.076 21.17 19.595 18.724 20.583 14.684 21.369 11.568 21.974 9.285 22.113 7.848 22.113 7.421 22.113 7.068 22.101 6.79 22.085 4.574 21.958 3.324 21.248 3.077 19.976 2.702 18.049 3.295 17.305 4.278 16.073L4.537 15.748C5.2 14.907 5.459 14.081 5.035 11.902 4.086 7.022 6.284 3.687 11.064 2.753 15.846 1.83 19.134 4.096 20.083 8.977 20.506 11.156 21.056 11.824 21.986 12.355L21.986 12.356 22.348 12.561C23.72 13.335 24.548 13.802 24.923 15.73Z"></path>
              </svg>
            </div>
          </li>

          <li>
            <div className={`${classes["navbar-actions-icon"]}`}>
              <svg viewBox="0 0 20 20" width="1em" height="1em">
                <path d="M10 14a1 1 0 0 1-.755-.349L5.329 9.182a1.367 1.367 0 0 1-.205-1.46A1.184 1.184 0 0 1 6.2 7h7.6a1.18 1.18 0 0 1 1.074.721 1.357 1.357 0 0 1-.2 1.457l-3.918 4.473A1 1 0 0 1 10 14z"></path>
              </svg>
            </div>
          </li>
          {/* <li onClick={authLoginHandler} className={`${classes["auth"]}`}>
            <Link to="/login">{isAuthLogin ? <>Login</> : <>Signup</>}</Link>
          </li> */}
        </ul>
      </div>
    </nav>
  );
};

export default MainNavigation;
