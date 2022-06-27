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
import { uiActions } from "./store/reducers/ui";

function App() {
  const [socket, setSocket] = useState(null);
  const cookies = new Cookies();
  const token = cookies.get("upid");
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();

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
        }
      } catch (error) {
        dispatch(uiActions.errors({ message: error.message }));
      }
    }
  }, [token, dispatch, navigate, userState.tokenExpiryState]);

  // const [notifications, setNotifications] = useState([]);
  // const inputCommentRef = useRef();
  // const [stateChange, setStateChange] = useState(true);

  useEffect(() => {
    if (token) {
      const socket = io.connect("http://localhost:8080", {
        auth: { token: `Bearer ${token}` },
      });

      socket.on("connect_error", (error) => {
        dispatch(userActions.logout());
        localStorage.clear("target");
        dispatch(
          uiActions.errors({
            message: "Couldn't connect to the server!",
          })
        );
      });

      setSocket(socket);
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (socket) {
      socket.emit("newUser");
    }
  }, [socket]);

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
              userState.authenticated ? (
                <Home socket={socket} />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          >
            <Route
              path="/:username/scream/:screamId"
              element={
                userState.authenticated ? (
                  <ScreamDisplay socket={socket} />
                ) : (
                  <Navigate replace to="/login" />
                )
              }
            />
            <Route
              path="/add-scream"
              element={
                userState.authenticated ? (
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
              userState.authenticated ? <Navigate replace to="/" /> : <Auth />
            }
          />
          <Route
            path="/login"
            element={
              userState.authenticated ? <Navigate replace to="/" /> : <Auth />
            }
          />

          <Route
            path="/my-profile"
            element={
              userState.authenticated ? (
                <Profile myProfile={true} />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />

          <Route
            path={`/users/:username`}
            element={
              userState.authenticated ? (
                <Profile />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />

          <Route path="/*" element={<Error />} />
        </Routes>

        {/* <Login />
      <div>
        <button onClick={googleAuthHandler}>Google</button>
      </div>

      <input type="file" onChange={handleChange} />
      <button onClick={uploadHandler}>Upload</button>

      <button onClick={likeHandler}>Like</button>
      <button onClick={unLikeHandler}>Unlike</button>

      <form onSubmit={addCommentHandler}>
        <input type="text" id="comment" ref={inputCommentRef} />
        <button>Add comment</button>
      </form>

      <button onClick={deleteCommentHandler}>Delete Comment</button>
      <button onClick={deleteScreamHandler}>Delete Scream</button>

      <button onClick={stateChangeFun}>Change</button> */}
      </Layout>
    </>
  );
}

export default App;
