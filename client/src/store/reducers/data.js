import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import { uiActions } from "./ui";
import axios from "axios";

export const getScreams = createAsyncThunk(
  "data/getScreams",
  (data, { dispatch }) => {
    const cookies = new Cookies();
    const token = cookies.get("upid");

    dispatch(uiActions.errorsNullify());
    dispatch(uiActions.setLoader());

    axios
      .get("/api/scream/screams", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        if (res.status !== 200 || res.statusText !== "OK") {
          const error = new Error("Can't load screams!");
          throw error;
        }

        dispatch(dataSlice.actions.setScreams(res.data));
      })
      .catch((error) => {
        if (!error.response) {
          dispatch(uiActions.errors(error.message));
        } else {
          dispatch(uiActions.errors(error.response.data));
        }
      });

    dispatch(uiActions.setLoader());
  }
);

export const postScream = createAsyncThunk(
  "data/postScream",
  async (body, { dispatch }) => {
    const cookies = new Cookies();
    const token = cookies.get("upid");

    dispatch(uiActions.errorsNullify());
    dispatch(uiActions.setLoader());

    try {
      const res = await axios({
        url: `/api/scream/create`,
        method: "POST",
        data: {
          body: body.bodyInput,
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (res.status !== 201 || res.statusText !== "Created") {
        const error = new Error("Unauthorized!");
        throw error;
      }

      dispatch(dataSlice.actions.addNewScream(res.data.scream));
      dispatch(uiActions.closeModal());
      body.navigate("/");
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

export const deleteScream = createAsyncThunk(
  "data/deleteScream",
  async (data, { dispatch }) => {
    const cookies = new Cookies();
    const token = cookies.get("upid");

    const { socket } = data;

    try {
      dispatch(dataSlice.actions.deleteUserScream(data));
      const res = await axios.delete(`/api/scream/${data.id}/delete`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (res.status !== 200 || res.statusText !== "OK") {
        const error = new Error("Unauthorized!");
        throw error;
      }

      socket.emit("sendDeleteScreamNotification", {
        screamId: data.id,
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

export const getScream = createAsyncThunk(
  "data/getScream",
  async (data, { dispatch }) => {
    const cookies = new Cookies();
    const token = cookies.get("upid");

    dispatch(uiActions.setLoader());
    dispatch(dataSlice.actions.nullifyCurrentScreamData());

    try {
      const res = await axios.get(`/api/scream/${data.id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (res.status !== 200 || res.statusText !== "OK") {
        const error = new Error("Unauthorized!");
        throw error;
      }

      await dispatch(
        dataSlice.actions.setCurrentScreamData({
          dataLoad: res.data,
          likeStatus: data.likeStatus,
        })
      );

      await dispatch(
        dataActions.setCurrentLikeStatus({ likeStatus: data.likeStatus })
      );
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

export const addComment = createAsyncThunk(
  "data/addComment",
  async (data, { dispatch }) => {
    const cookies = new Cookies();
    const token = cookies.get("upid");
    const { socket } = data;

    dispatch(uiActions.setLoader());

    try {
      const res = await axios.post(
        `/api/scream/${data.screamId}/addComment`,
        {
          body: data.body,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (res.status !== 201 || res.statusText !== "Created") {
        const error = new Error("Unauthorized!");
        throw error;
      }

      dispatch(dataSlice.actions.addNewComment(res.data));

      socket.emit("sendCommentNotification", {
        receiverId: data.userId,
        message: data.body,
        screamId: data.screamId,
        commentId: res.data.comment._id,
      });
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

export const deleteComment = createAsyncThunk(
  "data/deleteComment",
  async (data, { dispatch }) => {
    const cookies = new Cookies();
    const token = cookies.get("upid");
    const { socket } = data;

    dispatch(uiActions.setLoader());

    try {
      dispatch(
        dataSlice.actions.deleteComment({
          commentId: data.commentId,
          screamId: data.screamId,
        })
      );

      const res = await axios.delete(
        `/api/scream/${data.userHandle}/${data.screamId}/${data.commentId}/deleteComment`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (res.status !== 200 || res.statusText !== "OK") {
        const error = new Error("Unauthorized!");
        throw error;
      }

      socket.emit("sendRemoveCommentNotification", {
        commentId: data.commentId,
        receiverId: data.userId,
        screamId: data.screamId,
      });
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
  "data/getUser",
  async (data, { getState, dispatch }) => {
    const cookies = new Cookies();
    const token = cookies.get("upid");

    dispatch(uiActions.setLoader());

    try {
      const res = await axios.get(`/api/user/${data.userId}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (res.status !== 200 || res.statusText !== "OK") {
        const error = new Error("Unauthorized!");
        throw error;
      }

      dispatch(dataSlice.actions.setShowCurrentUser(res.data));
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

const dataSlice = createSlice({
  name: "data",
  initialState: {
    screams: null,
    currentScreamData: null,
    currentUser: null,
  },

  reducers: {
    setShowCurrentUser(state, action) {
      state.currentUser = {
        ...action.payload._doc,
        screams: action.payload.screams,
      };
    },

    setCurrentScreamData(state, action) {
      state.currentScreamData = {
        ...action.payload.dataLoad.data,
        comments: action.payload.dataLoad.comments,
        likeStatus: action.payload.likeStatus,
      };
    },

    setCurrentLikeStatus(state, action) {
      state.currentScreamData.likeStatus = action.payload.likeStatus;
    },

    nullifyCurrentScreamData(state, action) {
      state.currentScreamData = null;
    },

    setScreams(state, action) {
      state.screams = [...action.payload.screams];
    },

    increamentLike(state, action) {
      const index = state.screams.findIndex(
        (scream) => scream._id === action.payload.screamId
      );

      state.screams[index].likeCount += 1;
    },

    decrementLike(state, action) {
      const index = state.screams.findIndex(
        (scream) => scream._id === action.payload.screamId
      );

      state.screams[index].likeCount -= 1;
    },

    deleteUserScream(state, action) {
      const updatedScreams = state.screams.filter(
        (scream) => scream._id !== action.payload.id
      );

      state.screams = updatedScreams;
    },

    deleteComment(state, action) {
      const commentIndex = state.currentScreamData.comments.findIndex(
        (comment) => comment._id === action.payload.commentId
      );

      state.currentScreamData.comments.splice(commentIndex, 1);
      state.currentScreamData.commentCount -= 1;

      const screamIndex = state.screams.findIndex(
        (scream) => scream._id === action.payload.screamId
      );

      state.screams[screamIndex].commentCount -= 1;
    },

    addNewScream(state, action) {
      state.screams.unshift(action.payload);
    },

    addNewComment(state, action) {
      state.currentScreamData.comments.unshift(action.payload.comment);
      state.currentScreamData.commentCount += 1;
      let screamIndex = state.screams.findIndex(
        (scream) => scream._id === action.payload.comment.screamId
      );

      if (screamIndex !== -1) {
        state.screams[screamIndex].commentCount += 1;
      }
    },

    updateUserPhoto(state, action) {
      console.log(state.screams);
      for (let scream of state.screams) {
        if (scream.userHandle === action.payload.userId) {
          scream.userImageUrl = action.payload.imageUrl;
        }
      }
    },
  },
});

export default dataSlice.reducer;
export const dataActions = dataSlice.actions;
