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

      if (cookies.get("upid")) {
        cookies.remove("upid");
      }

      cookies.set("upid", res.data.token);
      dispatch(userSlice.actions.authenticated());
      dispatch(getUser());

      userData.navigate("/", { replace: true });
    } catch (error) {
      const token = cookies.get("upid");
      if (token) {
        userData.navigate("/error", { replace: true });
        dispatch(uiActions.setLoader());
        return;
      }

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

export const addUserDetails = createAsyncThunk(
  "user/addUserDetails",
  async (userData, { dispatch }) => {
    const cookies = new Cookies();
    const token = cookies.get("upid");

    try {
      const res = await axios({
        method: "PUT",
        url: `/api/user/updateProfile`,
        data: userData,
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (res.status !== 200 || res.statusText !== "OK") {
        const error = new Error("Some error occured!");
        throw error;
      }

      dispatch(userActions.setUserDetails(userData));
      userData.setIsLoading(false);
      dispatch(uiActions.closeModal());
    } catch (error) {
      if (!error.response) {
        dispatch(uiActions.errors(error.message));
      } else {
        dispatch(uiActions.errors(error.response.data));
      }

      userData.setIsLoading(false);
    }
  }
);

export const updateProfilePhoto = createAsyncThunk(
  "user/updateProfilePhoto",
  async (userData, { dispatch, getState }) => {
    const cookies = new Cookies();
    const token = cookies.get("upid");
    const state = getState();

    try {
      const result = await fetch("/api/user/updateProfilePhoto", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: userData.formData,
      });

      const data = await result.json();

      if (result.status !== 200 || !result.ok) {
        const error = new Error("Some error occured!");
        if (data.message) {
          error.message = data.message;
        }

        throw error;
      }

      dispatch(userActions.setProfilePhoto(data));
      userData.setIsLoading(false);
      dispatch(
        dataActions.updateUserPhoto({
          imageUrl: data.imageUrl,
          userId: state.user.userId,
        })
      );
      dispatch(uiActions.closeModal());
    } catch (error) {
      if (!error.response) {
        dispatch(uiActions.errors(error.message));
      } else {
        dispatch(uiActions.errors(error.response.data));
      }

      userData.setIsLoading(false);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: null,
    decodedTokenState: null,
    tokenExpiryState: null,
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
      localStorage.clear("target");

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

    setNotificationsMarked(state, action) {
      state.notifications.map((notification) => (notification.read = true));
    },

    setDecodedTokenState(state, action) {
      state.decodedTokenState = action.payload || null;
    },

    setTokenExpiryState(state, action) {
      state.tokenExpiryState = action.payload || null;
    },

    setUserDetails(state, action) {
      state.credentials.bio = action.payload.bio;
      state.credentials.address = action.payload.address;
      state.credentials.age = action.payload.age;
      state.credentials.website = action.payload.website;
    },

    setProfilePhoto(state, action) {
      state.credentials.imageUrl = action.payload.imageUrl;
    },
  },

  extraReducers: {},
});

export default userSlice.reducer;
export const userActions = userSlice.actions;
