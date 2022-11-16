import React, { useState, useEffect } from "react";
import { useRef } from "react";
import classes from "./Auth.module.scss";
import Google from "../components/svg/Google";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../store/reducers/user";
import { uiActions } from "../store/reducers/ui";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();
  const usernameInputRef = useRef();
  const nameInputRef = useRef();
  const dispatch = useDispatch();
  const uiState = useSelector((state) => state.ui);
  const navigate = useNavigate();
  const [validationData, setValidationData] = useState(null);

  const googleAuthHandler = () => {
    window.open("/api/auth/google", "_self");
  };

  const switchAuthHandler = () => {
    setValidationData(null);
    dispatch(uiActions.errorsNullify());
    dispatch(uiActions.switchAuth());
  };

  useEffect(() => {
    setValidationData(false);
  }, [uiState.isAuthLogin]);

  const loginHandler = async (e) => {
    e.preventDefault();

    dispatch(uiActions.errorsNullify());
    setValidationData(null);
    let authData;

    if (uiState.isAuthLogin) {
      authData = {
        email: emailInputRef.current.value,
        password: passwordInputRef.current.value,
      };

      if (!authData.email || !authData.password) {
        setValidationData("Please enter your details.");
        return;
      }
    } else {
      authData = {
        username: usernameInputRef.current.value,
        name: nameInputRef.current.value,
        email: emailInputRef.current.value,
        password: passwordInputRef.current.value,
        confirmPassword: confirmPasswordInputRef.current.value,
      };

      if (
        !authData.email ||
        !authData.password ||
        !authData.username ||
        !authData.confirmPassword ||
        !authData.name
      ) {
        setValidationData("Please enter all details.");
        return;
      }
    }

    let authUrl;
    if (uiState.isAuthLogin) {
      authUrl = "/api/auth/login";
    } else {
      authUrl = "/api/auth/signup";
    }

    dispatch(auth({ authData, authUrl, navigate }));
  };

  useEffect(() => {
    if (uiState.errors) {
      if (uiState.errors.errorData) {
        setValidationData(uiState.errors.errorData[0].msg);
      } else {
        setValidationData(uiState.errors.message);
      }
    }
  }, [uiState.errors]);

  return (
    <main className={classes.main}>
      <div className={classes.container}>
        <section className={classes.wrapper}>
          <div className={classes.heading}>
            <h1 className={`${classes.text} ${classes["text-large"]}`}>
              {uiState.isAuthLogin ? <>Log In</> : <>Sign up</>}
            </h1>
            <p className={`${classes.text} ${classes["text-normal"]}`}>
              {uiState.isAuthLogin ? (
                <span>New user?</span>
              ) : (
                <span>Already a user? </span>
              )}
              <span>
                {uiState.isAuthLogin ? (
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

          {validationData && (
            <p className={classes.validate}>{validationData}</p>
          )}
          <form
            name="login"
            className={classes.form}
            noValidate
            onSubmit={loginHandler}
          >
            {!uiState.isAuthLogin && (
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

            {!uiState.isAuthLogin && (
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
              {uiState.isAuthLogin && (
                <Link
                  to="#"
                  className={`${classes.text} ${classes["text-links"]}`}
                >
                  Forgot Password
                </Link>
              )}

              {uiState.isAuthLogin ? (
                <button
                  type="submit"
                  name="submit"
                  className={`${classes["input-submit"]}`}
                >
                  {uiState.loader ? (
                    <div className={`${classes["dual-ring"]}`}></div>
                  ) : (
                    <span> Login</span>
                  )}
                </button>
              ) : (
                <button
                  type="submit"
                  name="submit"
                  className={`${classes["input-submit"]} ${classes.signup}`}
                >
                  {uiState.loader ? (
                    <div className={`${classes["dual-ring"]}`}></div>
                  ) : (
                    <span> Signup</span>
                  )}
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
              <button
                onClick={googleAuthHandler}
                className={`${classes["method-action"]}`}
              >
                <Google />
                <span>Sign in with Google</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;
