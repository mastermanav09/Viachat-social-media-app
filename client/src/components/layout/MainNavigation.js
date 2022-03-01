import React, { useState } from "react";
import classes from "./MainNavigation.module.scss";
import { Link, NavLink } from "react-router-dom";
import Dropdown from "../UI/Dropdown";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../../store/reducers/user";
import { uiActions } from "../../store/reducers/ui";
import { DownsideArrow } from "../svg/DownsideArrow";
import NotificationsBell from "../svg/NotificationsBell";

const MainNavigation = () => {
  const [showNavbarBtn, setshowNavbarBtn] = useState(false);
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const uiState = useSelector((state) => state.ui);

  const authHandler = () => dispatch(uiActions.switchAuth());
  const authLogoutHandler = () => dispatch(userActions.logout());

  function closeNavbar() {
    setshowNavbarBtn(false);
  }

  console.log(uiState.showNavbarOptions);
  return (
    <>
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
            {userState.authenticated && (
              <>
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
              </>
            )}
          </ul>
        </div>

        <div className={`${classes["navbar-nav"]}`}>
          <ul className={`${classes["nav-list"]}`}>
            {userState.authenticated && (
              <>
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
                  <div
                    className={[
                      classes["navbar-actions-icon"],
                      uiState.showNotifications ? classes.active : "",
                    ].join(" ")}
                    onClick={() => dispatch(uiActions.showNotifications())}
                  >
                    <NotificationsBell />
                  </div>
                </li>

                <li>
                  <div
                    className={[
                      classes["navbar-actions-icon"],
                      uiState.showNavbarOptions ? classes.active : "",
                    ].join(" ")}
                    onClick={() => dispatch(uiActions.showNavbarOptions())}
                  >
                    <DownsideArrow />
                  </div>
                </li>
              </>
            )}

            {userState.authenticated ? (
              <li onClick={authLogoutHandler} className={`${classes["auth"]}`}>
                <span></span>
              </li>
            ) : (
              <li onClick={authHandler} className={`${classes["auth"]}`}>
                {!uiState.isAuthLogin ? (
                  <Link to="/login">
                    <span>Login</span>
                  </Link>
                ) : (
                  <Link to="/signup">
                    <span>Signup</span>
                  </Link>
                )}
              </li>
            )}
          </ul>
        </div>

        <div
          onClick={() => setshowNavbarBtn((prev) => !prev)}
          className={
            showNavbarBtn
              ? `${classes["navbar-btn"]} ${classes.active}`
              : `${classes["navbar-btn"]}`
          }
        >
          <div className={`${classes["bar"]}`}></div>w
          <div className={`${classes["bar"]}`}></div>
          <div className={`${classes["bar"]}`}></div>
        </div>
      </nav>
      {showNavbarBtn && <Dropdown close={closeNavbar} />}

      {uiState.showNavbarOptions && (
        <div className={classes.options}>
          <div className={`${classes["options-wrapper"]}`}>
            <div></div>
          </div>
        </div>
      )}

      {uiState.showNotifications && (
        <div className={classes.notifications}></div>
      )}
    </>
  );
};

export default MainNavigation;
