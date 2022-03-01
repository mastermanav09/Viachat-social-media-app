import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import { uiActions } from "./ui";
import axios from "axios";

export const getScreams = createAsyncThunk(
  "data/getScreams",
  async (data, { dispatch }) => {
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

const dataSlice = createSlice({
  name: "data",
  initialState: {
    screams: null,
  },

  reducers: {
    setScreams(state, action) {
      state.screams = [...action.payload.screams];
    },
  },
});

export default dataSlice.reducer;
export const dataActions = dataSlice.actions;
