import Cookies from "universal-cookie";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { uiActions } from "./ui";
import { dataActions } from "./data";

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
      // const reader = new FileReader();

      // localStorage.setItem()
      // reader.readAsDataURL();
    } catch (error) {
      if (!error.response) {
        dispatch(uiActions.errors(error.message));
      } else {
        dispatch(uiActions.errors(error.response.data));
      }
    }
  }
);

export const likeScream = createAsyncThunk(
  "user/likeScream",
  async (data, { dispatch }) => {
    const cookies = new Cookies();
    const token = cookies.get("upid");
    const { socket } = data;

    try {
      const res = await axios({
        method: "GET",
        url: `/api/scream/${data.id}/like`,
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (res.status !== 200 || res.statusText !== "OK") {
        const error = new Error("Can't load screams!");
        throw error;
      }

      dispatch(dataActions.increamentLike(res.data.like));
      dispatch(userSlice.actions.addLikedScream(res.data.like));

      socket.emit("sendLikeNotification", {
        screamId: data.id,
        receiverId: data.userId,
      });
    } catch (error) {
      if (!error.response) {
        dispatch(uiActions.errors(error.message));
      } else {
        dispatch(uiActions.errors(error.response.data));
      }
    }
  }
);

export const unlikeScream = createAsyncThunk(
  "user/unlikeScream",
  async (data, { dispatch }) => {
    const cookies = new Cookies();
    const token = cookies.get("upid");
    const { socket } = data;

    try {
      const res = await axios({
        method: "GET",
        url: `/api/scream/${data.id}/unlike`,
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (res.status !== 200 || res.statusText !== "OK") {
        const error = new Error("Can't load screams!");
        throw error;
      }

      dispatch(dataActions.decrementLike(res.data.like));
      dispatch(userSlice.actions.removeLikedScream(res.data.like));

      socket.emit("sendRemoveLikeNotification", {
        screamId: data.id,
        receiverId: data.userId,
      });
    } catch (error) {
      if (!error.response) {
        dispatch(uiActions.errors(error.message));
      } else {
        dispatch(uiActions.errors(error.response.data));
      }
    }
  }
);

export const markNotificationsRead = createAsyncThunk(
  "user/markNotificationsRead",
  async () => {
    const cookies = new Cookies();
    const token = cookies.get("upid");

    try {
      const res = await axios({
        method: "POST",
        url: `/api/user/markNotificationRead`,
        data: {},
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (res.status !== 200 || res.statusText !== "OK") {
        const error = new Error("Some error occured!");
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: null,
    authenticated: false,
    credentials: {},
    interactions: {
      likes: null,
      comments: null,
    },
    notifications: null,
  },

  reducers: {
    authenticated(state, action) {
      state.authenticated = true;
      state.userId = action.payload;
    },

    logout(state, action) {
      const cookies = new Cookies();
      cookies.remove("upid");

      state.userId = null;
      state.authenticated = false;
      state.credentials = {};
      state.interactions = {
        likes: null,
        comments: null,
      };
      state.notifications = null;
    },

    setUserData(state, action) {
      state.credentials = {
        ...action.payload.user.credentials,
        provider: action.payload.user.provider || undefined,
        joined: action.payload.user.createdAt,
      };
      state.notifications = [...action.payload.notifications];

      state.interactions = {
        likes: action.payload.likes,
        comments: action.payload.comments,
      };
    },

    addLikedScream(state, action) {
      state.interactions.likes = [action.payload, ...state.interactions.likes];
    },

    removeLikedScream(state, action) {
      let index;
      if (state.interactions.likes) {
        index = state.interactions.likes.findIndex(
          (scream) => scream._id === action.payload._id
        );
      }

      if (index !== -1) {
        state.interactions.likes.splice(index, 1);
      }
    },

    getNotifications(state, action) {
      if (Array.isArray(action.payload)) {
        state.notifications = [...action.payload];
      } else {
        state.notifications.unshift(action.payload);
      }
    },
  },

  extraReducers: {},
});

export default userSlice.reducer;
export const userActions = userSlice.actions;
