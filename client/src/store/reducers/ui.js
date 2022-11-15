import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    errors: null,
    loader: false,
    isAuthLogin: true,
    showNavbarOptions: false,
    showNotifications: false,
    showChats: false,
    showChatPanel: false,
    showPostScreamModal: false,
    showScreamModal: false,
    showProfileEditModal: false,
    showUpdateProfilePictureModal: false,
    showSideBar: false,
    showScreamIdentifier: null,
    showMessagePanelMob: false,
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
      state.showChats = false;
    },

    showNotifications(state, action) {
      state.showNotifications = !state.showNotifications;
      state.showNavbarOptions = false;
      state.showChats = false;
    },

    showChats(state, action) {
      state.showChats = !state.showChats;
      state.showNavbarOptions = false;
      state.showNotifications = false;
    },

    showChatPanel(state, action) {
      state.showChatPanel = action.payload || !state.showChatPanel;
      state.showChats = false;
      state.showNavbarOptions = false;
      state.showNotifications = false;
    },

    clearBars(state, action) {
      state.showNotifications = false;
      state.showNavbarOptions = false;
      state.showChats = false;
    },

    showPostScreamModal(state, action) {
      state.showPostScreamModal = true;
      state.showScreamModal = false;
    },

    showScreamModal(state, action) {
      state.showScreamModal = true;
      state.showPostScreamModal = false;
    },

    showProfileEditModal(state, action) {
      state.showProfileEditModal = true;
      state.showUpdateProfilePictureModal = false;
    },

    setShowScreamIdentifier(state, action) {
      state.showScreamIdentifier = action.payload;
    },

    showUpdateProfilePictureModal(state, action) {
      state.showUpdateProfilePictureModal = true;
      state.showProfileEditModal = false;
    },

    setSideBar(state, action) {
      state.showSideBar = action.payload || !state.showSideBar;
    },

    setShowMessagePanelMob(state, action) {
      state.showMessagePanelMob = action.payload;
    },

    closeModal(state, action) {
      state.showScreamModal = false;
      state.showPostScreamModal = false;
      state.showProfileEditModal = false;
      state.showUpdateProfilePictureModal = false;
      state.showNotifications = false;
      state.showChats = false;
    },
  },
});

export default uiSlice.reducer;
export const uiActions = uiSlice.actions;
