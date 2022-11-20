import React from "react";
import classes from "./Sidebar.module.scss";
import { Link, NavLink } from "react-router-dom";
import Cross from "../svg/Cross";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/reducers/ui";
import Home from "../svg/Home";
import NotificationsBell from "../svg/NotificationsBell";
import { userActions } from "../../store/reducers/user";
import { SIDEBAR_MOBILE } from "../../utils/constants";
import Message from "../svg/Message";
import linkValidation from "../../utils/linkValidation";

const Sidebar = (props) => {
  const uiState = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const userCredentials = useSelector((state) => state.user.credentials);
  const userState = useSelector((state) => state.user);

  const navigateActionHandler = () => {
    dispatch(uiActions.setSideBar(false));
    dispatch(uiActions.closeModal());
  };

  const authHandler = () => {
    dispatch(uiActions.errorsNullify());
    dispatch(uiActions.switchAuth());
    dispatch(uiActions.setSideBar(false));
  };

  return (
    <>
      {uiState.showSideBar && (
        <div
          onClick={() => dispatch(uiActions.setSideBar())}
          className={classes.backdrop}
        ></div>
      )}
      <div
        className={[
          classes["sidebar"],
          !uiState.showSideBar ? classes["toggle"] : "",
        ].join(" ")}
      >
        <div className={classes["close-icon"]}>
          <Cross type={SIDEBAR_MOBILE} />
        </div>

        <div className={classes["mobile-main-navigation"]}>
          {!userState.authenticated && !userState.decodedTokenState && (
            <div className={classes["auth-handler-mob"]}>
              <ul>
                <li onClick={authHandler}>
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
              </ul>
            </div>
          )}

          {userState.authenticated && (
            <>
              <div className={classes["profile-block"]}>
                <ul>
                  <Link to="/my-profile" onClick={navigateActionHandler}>
                    <li className={classes["link"]}>
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
                        <div className={classes["details"]}>
                          <strong className={classes["username"]}>
                            {userCredentials.username}
                          </strong>
                          <div>See your profile</div>
                        </div>
                      </div>
                    </li>
                  </Link>
                </ul>
              </div>

              <div className={classes["navigation-block"]}>
                <ul className={classes["links"]}>
                  <NavLink
                    to="/"
                    onClick={navigateActionHandler}
                    className={(navData) =>
                      [
                        classes["link"],
                        navData.isActive ? classes.active : classes.inactive,
                      ].join(" ")
                    }
                  >
                    Home
                    <Home />
                  </NavLink>

                  <li
                    className={classes["link"]}
                    onClick={() => {
                      navigateActionHandler();
                      props.manageNotifications();
                    }}
                  >
                    Notifications
                    <NotificationsBell />
                  </li>

                  <NavLink
                    to="/my-profile/chats"
                    onClick={navigateActionHandler}
                    className={(navData) =>
                      [
                        classes["link"],
                        navData.isActive ? classes.active : classes.inactive,
                      ].join(" ")
                    }
                  >
                    Chats
                    <Message />
                  </NavLink>
                </ul>
              </div>

              <div className={classes["actions-block"]}>
                <ul>
                  <li
                    className={classes["link"]}
                    onClick={() => {
                      navigateActionHandler();
                      dispatch(userActions.logout());
                    }}
                  >
                    Log Out
                    <div>
                      <i data-visualcompletion="css-img"></i>
                    </div>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default Sidebar;
