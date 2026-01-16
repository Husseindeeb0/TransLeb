import { configureStore } from '@reduxjs/toolkit';
import { coordinatesApi } from '../services/coordinates/coordinatesAPI';
import { userApi } from '../services/user/userAPI';

export const store = configureStore({
  reducer: {
    // coordinates: coordinatesReducer,
    [coordinatesApi.reducerPath]: coordinatesApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      coordinatesApi.middleware,
      userApi.middleware
    ),
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
