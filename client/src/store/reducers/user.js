import Cookies from "universal-cookie";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { uiActions } from "./ui";

export const auth = createAsyncThunk(
  "user/auth",
  async (userData, { dispatch }) => {
    const cookies = new Cookies();

    dispatch(uiActions.errorsNullify());
    dispatch(uiActions.setLoader());
    try {
      const res = await axios({
        method: "POST",
        url: userData.authUrl,
        data: userData.authData,
      });

      cookies.set("upid", res.data.token);
      dispatch(userSlice.actions.authenticated());
      dispatch(getUser());

      userData.navigate("/", { replace: true });
    } catch (error) {
      if (!error.response) {
        dispatch(uiActions.errors(error.message));
      } else {
        dispatch(uiActions.errors(error.response.data));
      }
    }

    dispatch(uiActions.setLoader());
  }
);

export const getUser = createAsyncThunk(
  "user/getUser",
  async (data, { dispatch }) => {
    const cookies = new Cookies();
    const token = cookies.get("upid");

    try {
      const res = await axios({
        method: "GET",
        url: "/api/user/getUserDetails",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (res.status !== 200 || res.statusText !== "OK") {
        const error = new Error("Can't load screams!");
        throw error;
      }

      dispatch(userSlice.actions.setUserData(res.data));
    } catch (error) {
      if (!error.response) {
        dispatch(uiActions.errors(error.message));
      } else {
        dispatch(uiActions.errors(error.response.data));
      }
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    authenticated: false,
    credentials: {},
    interactions: null,
    notifications: null,
    screams: null,
  },

  reducers: {
    authenticated(state, action) {
      state.authenticated = true;
    },

    logout(state, action) {
      const cookies = new Cookies();
      cookies.remove("upid");

      state.authenticated = false;
      state.credentials = {};
      state.interactions = null;
      state.notifications = null;
      state.screams = null;
    },

    setUserData(state, action) {
      state.credentials = {
        ...action.payload.user.credentials,
        joined: action.payload.user.createdAt,
      };
      state.notifications = action.payload.notifications;
      state.interactions = {
        likes: action.payload.likes,
        comments: action.payload.comments,
      };

      state.screams = action.payload.screams;
    },
  },

  extraReducers: {},
});

export default userSlice.reducer;
export const userActions = userSlice.actions;
