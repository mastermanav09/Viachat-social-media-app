import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Cookies from "universal-cookie";
import {
  useNavigate,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import jwtDecode from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { getUser, userActions } from "./store/reducers/user";
import Profile from "./pages/Profile";
import PostScream from "./components/PostScream";
import ScreamDisplay from "./components/ScreamDisplay";
import Error from "./pages/Error";
import { dataActions, getScreams } from "./store/reducers/data";
import { uiActions } from "./store/reducers/ui";
import ChatPanel from "./components/ChatPanel";
import ChatMessagePanel from "./components/ChatMessagePanel";
import { getConversations } from "./store/reducers/user";

function App() {
  const [socket, setSocket] = useState(null);
  const cookies = new Cookies();
  const token = cookies.get("upid");
  const navigate = useNavigate();
  const userTokenExpiry = useSelector((state) => state.user.tokenExpiryState);
  const isUserAuthenticated = useSelector((state) => state.user.authenticated);
  const userId = useSelector((state) => state.user.userId);
  const dispatch = useDispatch();
  const location = useLocation();
  const errors = useSelector((state) => state.ui.errors);

  useEffect(() => {
    if (token) {
      let decodedToken;
      try {
        decodedToken = jwtDecode(token);

        if (!decodedToken) {
          const error = new Error("Something went wrong!");
          throw error;
        }

        if (decodedToken.exp * 1000 < Date.now()) {
          navigate("/login", { replace: true });
          dispatch(userActions.logout());
          localStorage.clear("target");
          dispatch(
            uiActions.errors({
              message: "Session Expired! Please login again.",
            })
          );
        } else {
          dispatch(userActions.authenticated(decodedToken.userId));
          dispatch(userActions.setTokenExpiryState(decodedToken.exp));
          dispatch(getUser());
          dispatch(getScreams());
          dispatch(getConversations());
        }
      } catch (error) {
        dispatch(uiActions.errors({ message: error.message }));
      }
    }
  }, [dispatch, navigate, token, userTokenExpiry]);

  useEffect(() => {
    async function initializeSocket() {
      if (token) {
        const socket = io.connect(process.env.HOST, {
          auth: { token: `Bearer ${token}` },
        });

        socket.on("connect", () => {
          console.log("Successfully connected!");
        });

        socket.on("connect_error", (error) => {
          console.log("Error socket");
          dispatch(userActions.logout());
          localStorage.clear("target");

          if (!errors) {
            dispatch(
              uiActions.errors({
                message: "Couldn't connect to the server!",
              })
            );
          }
        });

        setSocket(socket);
      }
    }

    initializeSocket();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("newUser");
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("getConversation", (data) => {
        dispatch(userActions.addNewConversation(data.conversation));
      });

      socket.on("getOnlineUsers", ({ users }) => {
        const usersSet = new Set();
        for (let user of users) {
          usersSet.add(user);
        }

        dispatch(dataActions.setOnlineUsers(usersSet));
      });
    }
  }, [socket, dispatch]);

  useEffect(() => {
    if (socket) {
      socket.emit("getOnlineUsersEvent", {
        senderId: userId,
      });
    }
  }, [socket, userId]);

  useEffect(() => {
    if (
      localStorage.getItem("target") ===
      location.pathname + location.search
    ) {
      navigate(localStorage.getItem("target"), { replace: true });
    } else {
      navigate(location.pathname, { replace: true });
    }
  }, []);

  return (
    <>
      <Layout socket={socket}>
        <Routes>
          <Route
            path="/"
            element={
              isUserAuthenticated ? (
                <Home socket={socket} />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          >
            <Route
              path="/:userId/scream/:screamId"
              element={
                isUserAuthenticated ? (
                  <ScreamDisplay socket={socket} />
                ) : (
                  <Navigate replace to="/login" />
                )
              }
            />

            <Route
              path="/add-scream"
              element={
                isUserAuthenticated ? (
                  <PostScream />
                ) : (
                  <Navigate replace to="/login" />
                )
              }
            />
          </Route>

          <Route
            path="/signup"
            element={
              isUserAuthenticated ? <Navigate replace to="/" /> : <Auth />
            }
          />
          <Route
            path="/login"
            element={
              isUserAuthenticated ? <Navigate replace to="/" /> : <Auth />
            }
          />

          <Route
            path="/my-profile"
            element={
              isUserAuthenticated ? (
                <Profile myProfile={true} socket={socket} />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          >
            <Route
              path="/my-profile/scream/:screamId"
              element={
                isUserAuthenticated ? (
                  <ScreamDisplay socket={socket} />
                ) : (
                  <Navigate replace to="/login" />
                )
              }
            />
          </Route>

          <Route
            path="/my-profile/chats"
            element={
              isUserAuthenticated ? (
                <ChatPanel socket={socket} />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          >
            <Route
              path="/my-profile/chats/:conversationId"
              element={
                isUserAuthenticated ? (
                  <ChatMessagePanel socket={socket} />
                ) : (
                  <Navigate replace to="/login" />
                )
              }
            />
          </Route>

          <Route
            path={`/users/:userId`}
            element={
              isUserAuthenticated ? (
                <Profile socket={socket} />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          >
            <Route
              path="/users/:userId/scream/:screamId"
              element={
                isUserAuthenticated ? (
                  <ScreamDisplay socket={socket} />
                ) : (
                  <Navigate replace to="/login" />
                )
              }
            />
          </Route>

          <Route path="/*" element={<Error />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
