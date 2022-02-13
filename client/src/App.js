import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

function App() {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:8080");
  }, []);

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

  return (
    <>
      <div>
        <button onClick={googleAuthHandler}>Google</button>
      </div>

      <input type="file" onChange={handleChange} />
      <button onClick={uploadHandler}>Upload</button>
    </>
  );
}

export default App;
