import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../lib/axios/axiosBaseQuery";

export const coordinatesApi = createApi({
  reducerPath: "coordinatesApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    addCoordinate: builder.mutation<
      { success: boolean },
      { lat: number; lng: number; userId: string }
    >({
      query: (coordinate) => ({
        url: "/coordinates/addCoordinate",
        method: "POST",
        data: coordinate,
      }),
    }),
    editCoordinate: builder.mutation<
      { success: boolean },
      { lat: number; lng: number; userId: string }
    >({
      query: (coordinate) => ({
        url: "/coordinates/editCoordinate",
        method: "PATCH",
        data: coordinate,
      }),
    }),
    deleteCoordinate: builder.mutation<
      { success: boolean },
      { userId: string }
    >({
      query: (userId) => ({
        url: "/coordinates/deleteCoordinate",
        method: "DELETE",
        data: userId,
      }),
    }),
  }),
});

export const {
  useAddCoordinateMutation,
  useEditCoordinateMutation,
  useDeleteCoordinateMutation,
} = coordinatesApi;
