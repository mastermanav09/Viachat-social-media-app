import React, { useState } from "react";
import axios from "axios";
import { useRef } from "react";
import Cookies from "universal-cookie";
import classes from "./Auth.module.scss";
import Google from "../components/svg/Google";
import { Link } from "react-router-dom";

const Auth = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();
  const usernameInputRef = useRef();
  const nameInputRef = useRef();
  const cookies = new Cookies();
  const [switchAuthLogIn, setSwitchAuthLogIn] = useState(true);

  const switchAuthHandler = () => {
    setSwitchAuthLogIn((prev) => !prev);
  };

  const loginHandler = async (e) => {
    e.preventDefault();

    let authData;

    if (switchAuthLogIn) {
      authData = {
        email: emailInputRef.current.value,
        password: passwordInputRef.current.value,
      };
    } else {
      authData = {
        username: usernameInputRef.current.value,
        name: nameInputRef.current.value,
        email: emailInputRef.current.value,
        password: passwordInputRef.current.value,
        confirmPassword: confirmPasswordInputRef.current.value,
      };
    }

    try {
      let authUrl;
      if (switchAuthLogIn) {
        authUrl = "/api/auth/login";
      } else {
        authUrl = "/api/auth/signup";
      }

      const res = await axios({
        method: "POST",
        url: authUrl,
        data: authData,
      });

      cookies.set("upid", res.data.token);
      cookies.set("_id", res.data.id);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
    }
  };

  return (
    <main className={classes.main}>
      <div className={classes.container}>
        <section className={classes.wrapper}>
          <div className={classes.heading}>
            <h1 className={`${classes.text} ${classes["text-large"]}`}>
              {switchAuthLogIn ? <>Log In</> : <>Sign up</>}
            </h1>
            <p className={`${classes.text} ${classes["text-normal"]}`}>
              {switchAuthLogIn ? (
                <span>New user?</span>
              ) : (
                <span>Already a user? </span>
              )}
              <span>
                {switchAuthLogIn ? (
                  <Link
                    to="/signup"
                    className={`${classes.text} ${classes["text-links"]}`}
                    onClick={switchAuthHandler}
                  >
                    Create an account
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className={`${classes.text} ${classes["text-links"]}`}
                    onClick={switchAuthHandler}
                  >
                    Log in here
                  </Link>
                )}
              </span>
            </p>
          </div>
          <form
            name="login"
            className={classes.form}
            noValidate
            onSubmit={loginHandler}
          >
            {!switchAuthLogIn && (
              <>
                <div className={`${classes["input-control"]}`}>
                  <label
                    htmlFor="email"
                    className={`${classes["input-label"]}`}
                    hidden
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    className={`${classes["input-field"]}`}
                    placeholder="Username"
                    ref={usernameInputRef}
                  />
                </div>
                <div className={`${classes["input-control"]}`}>
                  <label
                    htmlFor="email"
                    className={`${classes["input-label"]}`}
                    hidden
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`${classes["input-field"]}`}
                    placeholder="Name"
                    ref={nameInputRef}
                  />
                </div>
              </>
            )}

            <div className={`${classes["input-control"]}`}>
              <label
                htmlFor="email"
                className={`${classes["input-label"]}`}
                hidden
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className={`${classes["input-field"]}`}
                placeholder="Email Address"
                ref={emailInputRef}
              />
            </div>
            <div className="input-control">
              <label
                htmlFor="password"
                className={`${classes["input-label"]}`}
                hidden
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                className={`${classes["input-field"]}`}
                placeholder="Password"
                ref={passwordInputRef}
              />
            </div>

            {!switchAuthLogIn && (
              <div className={`${classes["input-control"]}`}>
                <label
                  htmlFor="confirm-password"
                  className={`${classes["input-label"]}`}
                  hidden
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  className={`${classes["input-field"]}`}
                  placeholder="Confirm Password"
                  ref={confirmPasswordInputRef}
                />
              </div>
            )}

            <div className={`${classes["input-control"]}`}>
              {switchAuthLogIn && (
                <a
                  href="#"
                  className={`${classes.text} ${classes["text-links"]}`}
                >
                  Forgot Password
                </a>
              )}

              {switchAuthLogIn ? (
                <button
                  type="submit"
                  name="submit"
                  className={`${classes["input-submit"]}`}
                >
                  Login
                </button>
              ) : (
                <button
                  type="submit"
                  name="submit"
                  className={`${classes["input-submit"]} ${classes.signup}`}
                >
                  Signup
                </button>
              )}
            </div>
          </form>
          <div className={classes.striped}>
            <span className={`${classes["striped-line"]}`}></span>
            <span className={`${classes["striped-text"]}`}>Or</span>
            <span className={`${classes["striped-line"]}`}></span>
          </div>
          <div className={classes.method}>
            <div className={`${classes["method-control"]}`}>
              <a href="#" className={`${classes["method-action"]}`}>
                <Google />
                <span>Sign in with Google</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;
