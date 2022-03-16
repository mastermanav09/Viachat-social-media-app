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
          body: body,
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (res.status !== 201) {
        const error = new Error("Unauthorized!");
        throw error;
      }

      dispatch(dataSlice.actions.addNewScream(res.data.scream));
      dispatch(uiActions.closeModal());
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

      dispatch(
        dataSlice.actions.setCurrentScreamData({
          dataLoad: res.data,
          likeStatus: data.likeStatus,
        })
      );

      dispatch(
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

// export const addComment = createAsyncThunk("data/addComment", async () => {});
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

      console.log(res.data);
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

    addNewScream(state, action) {
      state.screams.unshift(action.payload);
    },
  },
});

export default dataSlice.reducer;
export const dataActions = dataSlice.actions;
