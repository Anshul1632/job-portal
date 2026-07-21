import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import authReducer from "./slices/authSlice";
import jobReducer from "./slices/jobSlice";
import companyReducer from "./slices/companySlice";
import applicationReducer from "./slices/applicationSlice";

// redux-persist's default `redux-persist/lib/storage` import breaks under
// Vite's ESM bundling (getItem/setItem come back undefined). A plain
// localStorage wrapper avoids that CJS/ESM interop issue entirely.
const storage = {
  getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(window.localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
};

const rootReducer = combineReducers({
  auth: authReducer,
  job: jobReducer,
  company: companyReducer,
  application: applicationReducer,
});

// Only persist auth (the logged-in user object) - the real session lives in the
// httpOnly cookie the backend sets; this just keeps the UI aware of who's logged
// in across page refreshes.
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
