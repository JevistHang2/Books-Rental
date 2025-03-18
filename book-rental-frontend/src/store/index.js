import { configureStore } from "@reduxjs/toolkit";
import {combineReducers} from 'redux';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import usersReducer from './usersReducer.js'
import bookTypesReducer from './bookTypesReducer.js';
import booksReducer from "./booksReducer.js";
import usersAdminStaffReducer from "./usersAdminStaffReducer.js";
import usersMemberUserReducer from "./usersMemberUserReducer.js";
import bagsReducer from "./bagsReducer.js";
import rentalsReducer from "./rentalsReducer.js";
import historyReducer from "./historyReducer.js";
import dashboardReducer from "./dashboardReducer.js";
import userHistoryReducer from "./userHistoryReducer.js";
import paginationReducer from "./paginationReducer.js";

const rootReducer = combineReducers({
    users : usersReducer,
    bookTypes : bookTypesReducer,
    books : booksReducer,
    usersAdminStaff : usersAdminStaffReducer,
    usersMemberUser : usersMemberUserReducer,
    bags : bagsReducer,
    rentals : rentalsReducer,
    history : historyReducer,
    dashboard : dashboardReducer,
    userHistories : userHistoryReducer,
    pagination : paginationReducer
  });

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
