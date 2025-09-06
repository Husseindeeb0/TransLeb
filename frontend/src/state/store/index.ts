import { configureStore } from "@reduxjs/toolkit";
import { coordinatesApi } from '../services/coordinates/coordinatesAPI';
// import coordinatesReducer from '../slices/coordinates/coordinatesSlice.ts';

export const store = configureStore({
  reducer: {
    // coordinates: coordinatesReducer,
    [coordinatesApi.reducerPath]: coordinatesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(coordinatesApi.middleware),
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
