import React from "react";
import axios from "axios";
import { useRef } from "react";
import Cookies from "universal-cookie";

const Login = () => {
  const cookies = new Cookies();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const loginHandler = async (e) => {
    e.preventDefault();

    const loginData = {
      email: emailInputRef.current.value,
      password: passwordInputRef.current.value,
    };

    try {
      const res = await axios({
        method: "POST",
        url: "http://localhost:8080/api/auth/login",
        data: loginData,
      });

      if (res.status !== 200 || res.statusText != "OK") {
        console.log("Cannot authenticate, Please try again!");
      }

      cookies.set("upid", res.data.token);
      cookies.set("_id", res.data.id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={loginHandler}>
      <input type="email" id="email" ref={emailInputRef} />
      <input type="password" id="password" ref={passwordInputRef} />
      <button>Login</button>
    </form>
  );
};

export default Login;
