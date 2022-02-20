import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Login from "./pages/Login";
import Cookies from "universal-cookie";

function App() {
  const cookies = new Cookies();
  const [image, setImage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const userId = cookies.get("_id");
  const inputCommentRef = useRef();
  const [stateChange, setStateChange] = useState(true);

  useEffect(() => {
    const token = cookies.get("upid");
    const socket = io.connect("http://localhost:8080", {
      auth: { token: `Bearer ${token}` },
    });

    socket.on("connect_error", (error) => {
      console.log(error);
    });

    setSocket(socket);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("newUser");
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("getNotification", (data) => {
        console.log(data);
        // setNotifications((prev) => {
        //   return { ...prev, data };
        // })
      });
    }
  }, [socket]);

  const likeHandler = () => {
    socket.emit("sendLikeNotification", {
      receiverId: "620a4b6c63d49ec329e8c95c", // present in post
      screamId: "621188bc02a076e236120a10",
    });
  };

  const unLikeHandler = () => {
    socket.emit("sendRemoveLikeNotification", {
      screamId: "6211379683d903889cd16cf3",
      receiverId: "620a4b6c63d49ec329e8c95c", // present in post
    });
  };

  const googleAuthHandler = () => {
    window.open("http://localhost:8080/api/auth/google", "_self");
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const stateChangeFun = () => {
    console.log(stateChange);
    setStateChange((prev) => !prev);
  };

  const uploadHandler = async () => {
    const formData = new FormData();
    formData.append("image", image);

    const result = await fetch(
      "http://localhost:8080/api/users/updateProfile",
      {
        method: "PUT",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWY1YjlkYTAyZjY4MDBiNGQzMTAwYTQiLCJlbWFpbCI6Im1hbmF2bmFoYXJ3YWxwQGdtYWlsLmNvbSIsImlhdCI6MTY0MzQ5Mzg1MCwiZXhwIjoxNjQzNDk3NDUwfQ.CWWaYUfa9p5uRSlBGIUZ1IvCcSRH04fDoTaX-CHitSU",
        },
        body: formData,
      }
    );

    console.log(result);
  };

  const addCommentHandler = (event) => {
    event.preventDefault();
    socket.emit("sendCommentNotification", {
      receiverId: "620a4b6c63d49ec329e8c95c", // present in post
      message: inputCommentRef.current.value,
      screamId: "621188bc02a076e236120a10",
      commentId: "6211898ee0befaeaabcf8c47",
    });
  };

  const deleteCommentHandler = (event) => {
    event.preventDefault();
    socket.emit("sendRemoveCommentNotification", {
      commentId: "621183c66a4af2945bcadb2a",
      receiverId: "620a4b6c63d49ec329e8c95c", // present in post
      screamId: "6211379683d903889cd16cf3",
    });
  };

  const deleteScreamHandler = (event) => {
    event.preventDefault();
    socket.emit("sendDeleteScreamNotification", {
      screamId: "621188bc02a076e236120a10",
    });
  };

  return (
    <>
      <Login />
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

      <button onClick={stateChangeFun}>Change</button>
    </>
  );
}

export default App;
