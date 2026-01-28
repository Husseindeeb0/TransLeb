import { configureStore } from '@reduxjs/toolkit';
import { coordinatesApi } from '../services/coordinates/coordinatesAPI';
import { userApi } from '../services/user/userAPI';
import { authApi } from '../services/auth/authAPI';
import { dayCardApi } from '../services/dayCard/dayCardAPI';
import { passengerFormApi } from '../services/passengerForm/passengerFormAPI';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [coordinatesApi.reducerPath]: coordinatesApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [dayCardApi.reducerPath]: dayCardApi.reducer,
    [passengerFormApi.reducerPath]: passengerFormApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      coordinatesApi.middleware,
      userApi.middleware,
      authApi.middleware,
      dayCardApi.middleware,
      passengerFormApi.middleware
    ),
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
