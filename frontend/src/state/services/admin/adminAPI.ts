import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../lib/axios/axiosBaseQuery";
import type {
  DriverDetailResponse,
  UpdateDriverStatusRequest,
  UpdateDriverSubscriptionRequest,
} from "../../../types/adminTypes";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AdminDrivers"],
  endpoints: (builder) => ({
    updateDriverStatus: builder.mutation<{ message: string; driver: Partial<DriverDetailResponse> }, UpdateDriverStatusRequest>({
      query: ({ driverId, active }) => ({
        url: `/admin/drivers/${driverId}/status`,
        method: "PATCH",
        data: { active },
      }),
      invalidatesTags: ["AdminDrivers"],
    }),
    updateDriverSubscription: builder.mutation<{ message: string; driver: Partial<DriverDetailResponse> }, UpdateDriverSubscriptionRequest>({
      query: ({ driverId, subscriptionStart, subscriptionEnd }) => ({
        url: `/admin/drivers/${driverId}/subscription`,
        method: "PATCH",
        data: { subscriptionStart, subscriptionEnd },
      }),
      invalidatesTags: ["AdminDrivers"],
    }),
    deleteDriver: builder.mutation<{ message: string }, string>({
      query: (driverId) => ({
        url: `/admin/drivers/${driverId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminDrivers"],
    }),
  }),
});

export const {
  useUpdateDriverStatusMutation,
  useUpdateDriverSubscriptionMutation,
  useDeleteDriverMutation,
} = adminApi;
