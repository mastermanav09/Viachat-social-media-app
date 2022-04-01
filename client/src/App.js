import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Cookies from "universal-cookie";
import { useNavigate, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import jwtDecode from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { getUser, userActions } from "./store/reducers/user";
import Profile from "./pages/Profile";
import ShowScream from "./components/ShowScream";
import PostScream from "./components/PostScream";

function App() {
  const cookies = new Cookies();
  const token = cookies.get("upid");
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const uiState = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      if (!decodedToken || decodedToken.exp * 1000 < Date.now()) {
        navigate("/login", { replace: true });
        dispatch(userActions.logout());
      } else {
        dispatch(userActions.authenticated(decodedToken.userId));
        dispatch(getUser());
      }
    }
  }, [token]);

  // const [image, setImage] = useState(null);
  const [socket, setSocket] = useState(null);
  // const [notifications, setNotifications] = useState([]);
  // const inputCommentRef = useRef();
  // const [stateChange, setStateChange] = useState(true);

  useEffect(() => {
    if (token) {
      const socket = io.connect("http://localhost:8080", {
        auth: { token: `Bearer ${token}` },
      });

      socket.on("connect_error", (error) => {
        console.log(error);
      });

      setSocket(socket);
    }
  }, [token]);

  useEffect(() => {
    if (socket) {
      socket.emit("newUser");
    }
  }, [socket]);

  // const handleChange = (e) => {
  //   if (e.target.files[0]) {
  //     setImage(e.target.files[0]);
  //   }
  // };

  // const uploadHandler = async () => {
  //   const formData = new FormData();
  //   formData.append("image", image);

  //   const result = await fetch(
  //     "http://localhost:8080/api/users/updateProfile",
  //     {
  //       method: "PUT",
  //       headers: {
  //         Authorization:
  //           "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWY1YjlkYTAyZjY4MDBiNGQzMTAwYTQiLCJlbWFpbCI6Im1hbmF2bmFoYXJ3YWxwQGdtYWlsLmNvbSIsImlhdCI6MTY0MzQ5Mzg1MCwiZXhwIjoxNjQzNDk3NDUwfQ.CWWaYUfa9p5uRSlBGIUZ1IvCcSRH04fDoTaX-CHitSU",
  //       },
  //       body: formData,
  //     }
  //   );

  //   console.log(result);
  // };

  return (
    <Layout socket={socket}>
      <Routes>
        <Route
          path="/"
          element={
            userState.authenticated ? <Home socket={socket} /> : <Auth />
          }
        >
          <Route
            path="/:username/scream/:screamId"
            element={<ShowScream socket={socket} />}
          />
          <Route
            path="/add-scream"
            element={uiState.showPostScreamModal && <PostScream />}
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
            userState.authenticated ? <Profile myProfile={true} /> : <Auth />
          }
        />

        <Route
          path={`/users/:username`}
          element={userState.authenticated ? <Profile /> : <Auth />}
        />
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
  );
}

export default App;
