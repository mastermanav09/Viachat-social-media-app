import React, { useState, useEffect } from "react";
import classes from "./MainNavigation.module.scss";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Sidebar from "../UI/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../../store/reducers/user";
import { uiActions } from "../../store/reducers/ui";
import { DownsideArrow } from "../svg/DownsideArrow";
import NotificationsBell from "../svg/NotificationsBell";
import Notifications from "../notification/Notifications";
import Home from "../svg/Home";
import Add from "../svg/Add";
import { markNotificationsRead } from "../../store/reducers/user";
import HamburgerIcon from "../UI/Hamburger";
import Message from "../svg/Message";
import Chats from "../chat/Chats";
import { dataActions } from "../../store/reducers/data";
import JumpingDot from "../svg/JumpingDot";
import Cookies from "js-cookie";
import SearchIcon from "../svg/SearchIcon";
import UserSearchBox from "../user/UserSearchBox";

const MainNavigation = (props) => {
  const dispatch = useDispatch();
  const onlineUsers = useSelector((state) => state.data.onlineUsers);
  const userState = useSelector((state) => state.user);
  const uiState = useSelector((state) => state.ui);
  const [unreadNotifications, setUnreadNotifications] = useState(null);
  const showChats = useSelector((state) => state.ui.showChats);
  const showChatPanel = useSelector((state) => state.ui.showChatPanel);
  const [getNewMessage, setGetNewMessage] = useState(false);
  const areUnreadMessages = useSelector((state) => state.ui.unreadMessages);
  const userCredentials = useSelector((state) => state.user.credentials);
  const { socket } = props;
  const navigate = useNavigate();

  useEffect(() => {
    if (
      userState.tokenExpiryState &&
      userState.tokenExpiryState * 1000 < Date.now()
    ) {
      Cookies.remove("upid");
      navigate("/login", { replace: true });
    }
  }, [navigate, userState.tokenExpiryState]);

  const authHandler = () => {
    dispatch(uiActions.errorsNullify());
    dispatch(uiActions.switchAuth());
  };

  useEffect(() => {
    if (socket) {
      socket.on("getConversation", (data) => {
        dispatch(userActions.addNewConversation(data.conversation));
      });

      socket.on("getOnlineUsers", ({ users, type }) => {
        let usersSet = new Set([...onlineUsers]);
        if (type === "add_user") {
          for (let user of users) {
            usersSet.add(user);
          }
        } else if (type === "remove_user") {
          for (let user of users) {
            usersSet.delete(user);
          }
        }

        dispatch(dataActions.setOnlineUsers(usersSet));
      });
    }
  }, [socket, dispatch]);

  useEffect(
    function () {
      if (getNewMessage) {
        if (!showChats && !showChatPanel) {
          dispatch(uiActions.toggleUnreadMessages(true));
          setGetNewMessage(false);
        }
      }

      if (showChatPanel || showChats) {
        setGetNewMessage(false);
        dispatch(uiActions.toggleUnreadMessages(false));
      }
    },
    [getNewMessage, dispatch, showChats, showChatPanel]
  );

  useEffect(() => {
    if (socket) {
      socket.on("getRecentMessage", (data) => {
        dispatch(
          userActions.updateConversation({
            conversationId: data.conversationId,
            text: data.text,
          })
        );

        setGetNewMessage(true);
      });
    }
  }, [socket, dispatch, getNewMessage, showChats, showChatPanel]);

  useEffect(() => {
    if (userState.notifications) {
      let notifications = userState.notifications.filter(
        (notification) => notification.read === false
      );

      setUnreadNotifications(notifications);
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
  }, [dispatch, socket]);

  const manageNotifications = () => {
    setUnreadNotifications(null);
    dispatch(userActions.setNotificationsMarked());

    dispatch(uiActions.showNotifications());
    dispatch(markNotificationsRead());
  };

  const manageChats = () => {
    dispatch(uiActions.showChats());
  };

  const manageUserSearch = () => {
    dispatch(uiActions.showUserSearchBox());
  };

  const logoutHandler = () => {
    dispatch(userActions.logout());
    navigate("/login", { replace: true });
    socket.disconnect();
  };

  let updatedUsername;

  if (userCredentials?.username?.length > 12) {
    updatedUsername = userCredentials.username.slice(0, 12);
    updatedUsername += "...";
  } else {
    updatedUsername = userCredentials?.username;
  }

  return (
    <>
      <nav
        className={`${classes.navbar} ${classes["navbar-dark"]} ${classes["bg-blue"]}`}
      >
        <Link to="/" style={{ textDecoration: "none", marginRight: "1rem" }}>
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
                <NavLink
                  to="/"
                  className={(navData) =>
                    navData.isActive
                      ? `${classes["nav-mid-list-link"]} ${classes.active}`
                      : `${classes["nav-mid-list-link"]}`
                  }
                >
                  <Home />
                </NavLink>

                <NavLink
                  to="/add-scream"
                  className={(navData) =>
                    navData.isActive
                      ? `${classes["nav-mid-list-link"]} ${classes.active}`
                      : `${classes["nav-mid-list-link"]}`
                  }
                  onClick={() => {
                    dispatch(uiActions.showPostScreamModal());
                    dispatch(uiActions.clearBars());
                  }}
                >
                  <Add />
                </NavLink>
              </>
            )}
          </ul>
        </div>

        <div className={`${classes["navbar-nav"]}`}>
          <ul className={`${classes["nav-list"]}`}>
            {userState.authenticated && (
              <>
                <NavLink
                  to="/my-profile"
                  className={(navData) => {
                    return navData.isActive
                      ? classes["my-profile-link"] + " " + classes.active
                      : `${classes["my-profile-link"]}`;
                  }}
                >
                  <li>
                    <div className={`${classes["profile-icon"]}`}>
                      {userCredentials.imageUrl ? (
                        <img
                          src={userCredentials.imageUrl}
                          referrerPolicy="no-referrer"
                          className="profile-img"
                          alt="profile-icon"
                        />
                      ) : (
                        <img
                          src="/images/no-img.png"
                          className="profile-img"
                          alt="profile-icon"
                        />
                      )}
                      <span>{updatedUsername}</span>
                    </div>
                  </li>
                </NavLink>
                <li>
                  {unreadNotifications && unreadNotifications.length !== 0 && (
                    <div className={classes["unread-notification-icon"]}>
                      {unreadNotifications.length}
                    </div>
                  )}
                </li>

                <li>
                  <div
                    className={[
                      classes["navbar-actions-icon"],
                      uiState.showUserSearchBox ? classes.active : "",
                    ].join(" ")}
                    onClick={manageUserSearch}
                  >
                    <SearchIcon />
                  </div>
                </li>

                <li>
                  <div
                    className={[
                      classes["navbar-actions-icon"],
                      uiState.showChats ? classes.active : "",
                    ].join(" ")}
                    onClick={manageChats}
                  >
                    <Message />
                    {areUnreadMessages && (
                      <div className={classes["unread-messages-icon"]}>
                        <JumpingDot />
                      </div>
                    )}
                  </div>
                </li>

                <li>
                  <div
                    className={[
                      classes["navbar-actions-icon"],
                      uiState.showNotifications ? classes.active : "",
                    ].join(" ")}
                    onClick={manageNotifications}
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
                    onClick={() => dispatch(uiActions.showNavbarOptions(true))}
                  >
                    <DownsideArrow />
                  </div>
                </li>
              </>
            )}

            {!userState.authenticated && !userState.decodedTokenState && (
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
          onClick={() => dispatch(uiActions.setSideBar())}
          style={{ marginLeft: "auto", height: "100%" }}
          className={classes["hamburger-action"]}
        >
          <HamburgerIcon showSidebarBtn={uiState.showSideBar} />
        </div>
      </nav>

      <Sidebar socket={socket} manageNotifications={manageNotifications} />

      {uiState.showNotifications && userState.authenticated && (
        <Notifications socket={props.socket} />
      )}

      {uiState.showChats && userState.authenticated && (
        <Chats socket={props.socket} />
      )}

      {uiState.showUserSearchBox && userState.authenticated && (
        <UserSearchBox socket={props.socket} />
      )}

      {uiState.showNavbarOptions && userState.authenticated && (
        <div className={classes.options}>
          <div className={`${classes["options-wrapper"]}`}>
            <NavLink
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
                <div className={classes["details"]}>
                  <strong>{userCredentials.username}</strong>
                  <div>See your profile</div>
                </div>
              </div>
            </NavLink>

            <hr />

            <div className={`${classes["logout-btn"]}`} onClick={logoutHandler}>
              <button>Logout</button>
              <div>
                <i data-visualcompletion="css-img"></i>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(MainNavigation);
