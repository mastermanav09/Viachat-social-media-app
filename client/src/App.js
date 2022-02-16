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

  useEffect(() => {
    setSocket(io("http://localhost:8080"));
  }, []);

  useEffect(() => {
    if (socket && userId) {
      socket.emit("newUser", userId);
    }
  }, [socket, userId]);

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
      senderId: userId,
      receiverId: "620a4b6c63d49ec329e8c95c", // present in post
      // screamId: screamId,
    });
  };

  const unLikeHandler = () => {
    socket.emit("sendRemoveLikeNotification", {
      screamId: null,
      senderId: userId,
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
      senderId: userId,
      receiverId: "620a4b6c63d49ec329e8c95c", // present in post
      message: inputCommentRef.current.value,
      // screamId: screamId,
      // commentId: commentId,
    });
  };

  const deleteCommentHandler = (event) => {
    event.preventDefault();
    socket.emit("sendRemoveCommentNotification", {
      // commentId: commentId,
      senderId: userId,
      receiverId: "620a4b6c63d49ec329e8c95c", // present in post
      // screamId: screamId,
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

      <form onSubmit={addCommentHandler}>
        <input type="text" id="comment" ref={inputCommentRef} />
        <button>Add comment</button>
      </form>
    </>
  );
}

export default App;
