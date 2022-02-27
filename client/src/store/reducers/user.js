import Cookies from "universal-cookie";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { uiActions } from "./ui";

export const auth = createAsyncThunk(
  "user/auth",
  async (userData, { dispatch }) => {
    const cookies = new Cookies();

    dispatch(uiActions.setLoader());
    try {
      const res = await axios({
        method: "POST",
        url: userData.authUrl,
        data: userData.authData,
      });

      cookies.set("upid", res.data.token);
      dispatch(userSlice.actions.authenticated());
      dispatch(userSlice.actions.setUserData(res.data));

      console.log(res.data);

      userData.navigate("/", { replace: true });
    } catch (error) {
      if (!error.response) {
        throw new Error("Authentication failed!");
      }

      dispatch(uiActions.errors(error.response.data));
    }

    dispatch(uiActions.setLoader());
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    authenticated: false,
    credentials: {},
    likes: [],
    notifications: [],
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
      state.likes = [];
      state.notifications = [];
    },

    setUserData(state, action) {},
  },

  extraReducers: {},
});

export default userSlice.reducer;
export const userActions = userSlice.actions;
