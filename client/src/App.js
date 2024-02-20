import React, { useEffect, useState, useLayoutEffect } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
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
import { useSelector, useDispatch } from "react-redux";
import { auth } from "./store/reducers/user";
import Profile from "./pages/Profile";
import PostScream from "../src/components/scream/PostScream";
import ScreamDisplay from "../src/components/scream/ScreamDisplay";
import Error from "./pages/Error";
import { getScreams } from "./store/reducers/data";
import ChatPanel from "../src/components/chat/ChatPanel";
import ChatMessagePanel from "../src/components/chat/ChatMessagePanel";

function App() {
  const [socket, setSocket] = useState(null);
  const token = Cookies.get("upid");
  const navigate = useNavigate();
  const isUserAuthenticated = useSelector((state) => state.user.authenticated);
  const userId = useSelector((state) => state.user.userId);
  const tokenExpiryState = useSelector((state) => state.user.tokenExpiryState);
  const dispatch = useDispatch();
  const location = useLocation();
  const totalResults = useSelector((state) => state.data.totalScreamsCount);
  const screams = useSelector((state) => state.data.screams || []);
  const [screamsLoader, setScreamsLoader] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (tokenExpiryState && tokenExpiryState * 1000 < Date.now()) {
      Cookies.remove("upid");
      navigate("/login", { replace: true });
    }
  }, [navigate, tokenExpiryState]);

  useEffect(() => {
    dispatch(auth({ navigate, socket }));
  }, [dispatch, navigate, socket]);

  useEffect(() => {
    if (token) {
      const socket = io.connect(process.env.REACT_APP_BASE_URL, {
        auth: { token: `Bearer ${token}` },
      });

      setSocket(socket);
    }
  }, [token]);

  useEffect(() => {
    if (socket) {
      socket.emit("newUser");
    }
  }, [socket, userId]);

  function handleScreamsLoading() {
    if (
      Math.abs(
        window.innerHeight +
          document.documentElement.scrollTop -
          document.documentElement.scrollHeight
      ) <= 100
    ) {
      setScreamsLoader(true);
      setPage((page) => page + 1);
    }
  }

  useEffect(() => {
    function getMoreScreams() {
      if (screams.length >= totalResults) {
        setScreamsLoader(false);
        return;
      }

      dispatch(getScreams({ page, setScreamsLoader }));
    }

    getMoreScreams();
  }, [dispatch, page, totalResults]);

  useEffect(() => {
    if (socket) {
      socket.emit("getOnlineUsersEvent");
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
                <Home
                  socket={socket}
                  handleScreamsLoading={handleScreamsLoading}
                  screamsLoader={screamsLoader}
                />
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
              isUserAuthenticated ? (
                <Navigate replace to="/" />
              ) : (
                <Auth socket={socket} />
              )
            }
          />
          <Route
            path="/login"
            element={
              isUserAuthenticated ? (
                <Navigate replace to="/" />
              ) : (
                <Auth socket={socket} />
              )
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
