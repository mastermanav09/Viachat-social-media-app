import Cookies from "universal-cookie";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { uiActions } from "./ui";
import { dataActions, getScreams } from "./data";
import jwtDecode from "jwt-decode";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

export const auth = createAsyncThunk(
  "user/auth",
  async (userData, { dispatch }) => {
    const cookies = new Cookies();
    const { navigate, socket } = userData;
    dispatch(uiActions.errorsNullify());
    dispatch(uiActions.setLoader());

    let existingToken = cookies.get("upid");
    if (existingToken) {
      let decodedToken = jwtDecode(existingToken);

      if (decodedToken) {
        dispatch(userActions.authenticated(decodedToken.userId));
        dispatch(userActions.setTokenExpiryState(decodedToken.exp));
        dispatch(getUser());
        dispatch(getScreams());
        dispatch(getConversations());
      } else {
        socket.emit("disconnectUserWhenLogout");
        dispatch(uiActions.setLoader());
        dispatch(userActions.logout());
        localStorage.clear("target");
        navigate("/login", { replace: true });
      }

      dispatch(uiActions.setLoader());
      return;
    }

    try {
      const res = await axios({
        method: "POST",
        url: userData.authUrl,
        data: userData.authData,
      });

      if (res.data.token) {
        const token = res.data.token;
        cookies.set("upid", token);

        let decodedToken = jwtDecode(token);

        dispatch(userActions.authenticated(decodedToken.userId));
        dispatch(userActions.setTokenExpiryState(decodedToken.exp));
        dispatch(getUser());
        dispatch(getScreams());
        dispatch(getConversations());

        userData.navigate("/", { replace: true });
      }
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
      dispatch(userSlice.actions.increamentLike(res.data.like));

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
      dispatch(userSlice.actions.decrementLike(res.data.like));
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
        data: {
          age: userData.age,
          bio: userData.bio,
          address: userData.address,
          website: userData.website,
          userId: userData.userId,
        },
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
      if (error.response?.data?.errorData[0].msg) {
        userData.setErrors(error.response.data.errorData[0].msg);
      } else {
        userData.setErrors(error.message);
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
        userData.setErrors(error.message);
      } else {
        userData.setErrors(error.response.data);
      }

      userData.setIsLoading(false);
    }
  }
);

export const addNewConversation = createAsyncThunk(
  "user/addNewConversation",
  async (data, { dispatch, getState }) => {
    const cookies = new Cookies();
    const token = cookies.get("upid");
    const { navigate, socket } = data;

    const state = getState();
    const userState = state.user;
    const { userId, conversations } = userState;

    let conversationIndex = conversations.findIndex((conversation) => {
      return (
        (conversation.members[0].userId === data.receiverId ||
          conversation.members[1].userId === data.receiverId) &&
        (conversation.members[0].userId === userId ||
          conversation.members[1].userId === userId)
      );
    });

    let conversation = conversations[conversationIndex];

    if (conversation) {
      navigate(`/my-profile/chats/${conversation._id}`);
      return;
    }

    try {
      const res = await axios({
        method: "POST",
        url: `/api/conversation/add`,
        data: { receiverId: data.receiverId },
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      conversation = res.data.conversation;
      const exists = res.data.exists;

      dispatch(userActions.addNewConversation(conversation));
      navigate(`/my-profile/chats/${conversation._id}`);

      if (!exists) {
        socket.emit("addNewConversation", {
          conversation,
          receiverId: data.receiverId,
        });
      }
    } catch (error) {
      // if (!error.response) {
      //   toast.error(error.response);
      // } else {
      //   toast.error(error.response.data);
      // }
    }
  }
);

export const getConversations = createAsyncThunk(
  "user/getConversations",
  async (data, { dispatch }) => {
    const cookies = new Cookies();
    const token = cookies.get("upid");

    try {
      const res = await axios({
        method: "GET",
        url: "/api/conversation",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (res.status !== 200 || res.statusText !== "OK") {
        const error = new Error("Can't load conversations!");
        throw error;
      }

      dispatch(userActions.setConversations(res.data));
    } catch (error) {
      if (!error.response) {
        dispatch(uiActions.errors(error.message));
      } else {
        dispatch(uiActions.errors(error.response.data));
      }
    }
  }
);

export const getMessages = createAsyncThunk(
  "user/getMessages",
  async (data, { dispatch }) => {
    const cookies = new Cookies();
    const token = cookies.get("upid");

    try {
      data.setIsLoading(true);

      const res = await axios({
        method: "GET",
        url: `/api/message/${data.conversationId}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (res.status !== 200 || res.statusText !== "OK") {
        const error = new Error("Can't load messages!");
        throw error;
      }

      dispatch(userActions.setMessages(res.data));
      data.setIsLoading(false);
    } catch (error) {
      if (!error.response) {
        dispatch(uiActions.errors(error.message));
      } else {
        dispatch(uiActions.errors(error.response.data));
      }
    }
  }
);

export const addNewMessage = createAsyncThunk(
  "user/addNewMessage",
  async (data, { dispatch }) => {
    const cookies = new Cookies();
    const token = cookies.get("upid");
    const { socket } = data;

    let tempId = Math.random();
    try {
      dispatch(
        userActions.addNewMessage({
          conversationId: data.newMessage.conversationId,
          message: {
            _id: tempId,
            sender: data.newMessage.sender,
            text: data.newMessage.text,
          },
        })
      );

      const res = await axios({
        method: "POST",
        url: `/api/message/addMessage`,
        data: data.newMessage,
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (res.status !== 201 || res.status === 404) {
        const error = new Error();
        throw error;
      }

      dispatch(
        userActions.addNewMessage({
          tempId: tempId,
          conversationId: data.newMessage.conversationId,
          message: res.data,
        })
      );

      socket.emit("sendMessage", {
        receiverId: data.newMessage.receiver,
        text: data.newMessage.text,
        _id: res.data._id,
      });

      socket.emit("receiveRecentMessage", {
        conversationId: data.newMessage.conversationId,
        receiverId: data.newMessage.receiver,
        senderId: data.newMessage.sender,
        text: data.newMessage.text,
      });
    } catch (error) {
      if (error) {
        data.setMessageNotSendError(tempId);
      }
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
    screams: [],
    conversations: null,
    messages: [],
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

      state.screams = action.payload.screams;
    },

    addLikedScream(state, action) {
      state.interactions.likes = [action.payload, ...state.interactions.likes];
    },

    increamentLike(state, action) {
      const index = state.screams.findIndex(
        (scream) => scream._id === action.payload.screamId
      );

      if (index !== -1) {
        state.screams[index].likeCount += 1;
      }
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

    decrementLike(state, action) {
      const index = state.screams.findIndex(
        (scream) => scream._id === action.payload.screamId
      );

      if (index !== -1) {
        state.screams[index].likeCount -= 1;
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

    setConversations(state, action) {
      state.conversations = action.payload;
    },

    setMessages(state, action) {
      state.messages.push(action.payload);
    },

    addNewMessage(state, action) {
      const conversationIndex = state.messages.findIndex(
        (message) => message.conversationId === action.payload.conversationId
      );

      if (action.payload.tempId) {
        const messageIndex = state.messages[
          conversationIndex
        ].messages.findIndex(
          (message) => message._id === action.payload.tempId
        );

        state.messages[conversationIndex].messages[messageIndex] =
          action.payload.message;

        return;
      }

      state.messages[conversationIndex].messages.push(action.payload.message);
    },

    addNewConversation(state, action) {
      state.conversations.unshift(action.payload);
    },

    updateConversation(state, action) {
      const conversationIndex = state.conversations.findIndex(
        (conversation) => conversation._id === action.payload.conversationId
      );

      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].recentMessage =
          action.payload.text;
      }
    },

    setProfilePhoto(state, action) {
      state.credentials.imageUrl = action.payload.imageUrl;
    },

    removeScream(state, action) {
      const updatedScreams = state.screams.filter(
        (scream) => scream._id !== action.payload.id
      );

      state.screams = updatedScreams;
    },
  },

  extraReducers: {},
});

export default userSlice.reducer;
export const userActions = userSlice.actions;
