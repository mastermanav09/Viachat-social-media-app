import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user.js";
import dataReducer from "./reducers/data.js";
import uiReducer from "./reducers/ui.js";

const store = configureStore({
  reducer: {
    user: userReducer,
    data: dataReducer,
    ui: uiReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: ["./reducers/user.js/addUserDetails"],
      },
    }).concat(),
});

export default store;
