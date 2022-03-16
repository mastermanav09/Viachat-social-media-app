import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    errors: null,
    loader: false,
    isAuthLogin: true,
    showNavbarOptions: false,
    showNotifications: false,
    showPostScreamModal: false,
    showScreamModal: false,
  },

  reducers: {
    errors(state, action) {
      state.errors = action.payload;
    },

    errorsNullify(state, action) {
      state.errors = null;
    },

    setLoader(state, action) {
      state.loader = !state.loader;
    },

    switchAuth(state, action) {
      state.isAuthLogin = !state.isAuthLogin;
    },

    showNavbarOptions(state, action) {
      state.showNavbarOptions = !state.showNavbarOptions;
      state.showNotifications = false;
    },

    showNotifications(state, action) {
      state.showNotifications = !state.showNotifications;
      state.showNavbarOptions = false;
    },

    clearBars(state, action) {
      state.showNotifications = false;
      state.showNavbarOptions = false;
    },

    showPostScreamModal(state, action) {
      state.showPostScreamModal = true;
      state.showScreamModal = false;
    },

    showScreamModal(state, action) {
      state.showScreamModal = true;
      state.showPostScreamModal = false;
    },

    closeModal(state, action) {
      state.showScreamModal = false;
      state.showPostScreamModal = false;
    },
  },
});

export default uiSlice.reducer;
export const uiActions = uiSlice.actions;
