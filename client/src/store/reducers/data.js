import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {},

  reducers: {},
});

export default dataSlice.reducer;
export const dataActions = dataSlice.actions;
