import React, { useState, useEffect } from "react";
import classes from "./MainNavigation.module.scss";
import { Link, NavLink } from "react-router-dom";
import Dropdown from "../UI/Dropdown";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../../store/reducers/user";
import { uiActions } from "../../store/reducers/ui";
import { DownsideArrow } from "../svg/DownsideArrow";
import NotificationsBell from "../svg/NotificationsBell";
import Notifications from "../Notifications";
import Home from "../svg/Home";
import Add from "../svg/Add";
import { markNotificationsRead } from "../../store/reducers/user";

const MainNavigation = (props) => {
  const [showNavbarBtn, setshowNavbarBtn] = useState(false);
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const uiState = useSelector((state) => state.ui);
  const [unreadNotifications, setUnreadNotifications] = useState(null);
  const authHandler = () => dispatch(uiActions.switchAuth());
  const authLogoutHandler = () => dispatch(userActions.logout());
  const userCredentials = useSelector((state) => state.user.credentials);
  const { socket } = props;

  function closeNavbar() {
    setshowNavbarBtn(false);
  }

  useEffect(() => {
    if (userState.notifications) {
      let unreadNotifications = userState.notifications.filter(
        (notification) => notification.read === false
      );

      setUnreadNotifications(unreadNotifications);
    }
  }, [userState.notifications]);

  useEffect(() => {
    if (socket) {
      socket.on("getNewNotification", (data) => {
        dispatch(userActions.getNotifications(data.notification));
      });

      socket.on("getNotifications", (data) => {
        dispatch(userActions.getNotifications(data.notifications));
      });
    }
  }, [socket]);

  useEffect(() => {
    if (uiState.showNotifications) {
      setUnreadNotifications(null);
      dispatch(markNotificationsRead());
    }
  }, [uiState.showNotifications, userState.notifications]);

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
                    <Home />
                  </li>
                </NavLink>

                <Link
                  to="/add-scream"
                  onClick={() => dispatch(uiActions.showPostScreamModal())}
                >
                  <li>
                    <Add />
                  </li>
                </Link>
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
                      {userCredentials.imageUrl ? (
                        <img
                          src={userCredentials.imageUrl}
                          referrerPolicy="no-referrer"
                          className="profile-img"
                          alt="picture"
                        />
                      ) : (
                        <img
                          src="/images/no-img.png"
                          className="profile-img"
                          alt="picture"
                        />
                      )}
                      <span>{userCredentials.username}</span>
                    </div>
                  </li>
                </Link>
                <li>
                  {unreadNotifications && unreadNotifications.length !== 0 && (
                    <div className={classes["unread-notification-icon"]}>
                      {unreadNotifications.length}
                    </div>
                  )}
                </li>
                <li style={{ position: "relative" }}>
                  <div
                    className={[
                      classes["navbar-actions-icon"],
                      uiState.showNotifications ? classes.active : "",
                    ].join(" ")}
                    onClick={() => {
                      setUnreadNotifications(null);
                      dispatch(uiActions.showNotifications());
                      dispatch(markNotificationsRead());
                    }}
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
      {uiState.showNavbarOptions && userState.authenticated && (
        <div className={classes.options}>
          <div className={`${classes["options-wrapper"]}`}>
            <Link
              to="/my-profile"
              onClick={() => dispatch(uiActions.clearBars())}
            >
              <div className={`${classes["profile-option"]}`}>
                <div className={`${classes["image-container"]}`}>
                  {userCredentials.imageUrl ? (
                    <img
                      src={userCredentials.imageUrl}
                      referrerPolicy="no-referrer"
                      alt="profile-icon"
                    />
                  ) : (
                    <img src="/images/no-img.png" alt="profile-icon" />
                  )}
                </div>
                <div>
                  <strong>{userCredentials.username}</strong>
                  <div>See your profile</div>
                </div>
              </div>
            </Link>

            <hr />

            <div
              className={`${classes["logout-btn"]}`}
              onClick={() => dispatch(userActions.logout())}
            >
              <button>Logout</button>
              <div>
                <i data-visualcompletion="css-img"></i>
              </div>
            </div>
          </div>
        </div>
      )}

      {uiState.showNotifications && userState.authenticated && (
        <Notifications socket={props.socket} />
      )}
    </>
  );
};

export default React.memo(MainNavigation);
