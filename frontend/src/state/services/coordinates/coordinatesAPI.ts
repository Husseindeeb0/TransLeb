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
      query: (coord) => ({
        url: "/coordinates/addCoordinate",
        method: "POST",
        data: coord,
      }),
    }),
    editCoordinate: builder.mutation<
      { success: boolean },
      { lat: number; lng: number; userId: string }
    >({
      query: (coord) => ({
        url: "/coordinates/editCoordinate",
        method: "PATCH",
        data: coord,
      }),
    }),
    deleteCoordinate: builder.mutation<
      { success: boolean },
      { userId: string }
    >({
      query: (coord) => ({
        url: "/coordinates/deleteCoordinate",
        method: "DELETE",
        data: coord,
      }),
    }),
  }),
});

export const {
  useAddCoordinateMutation,
  useEditCoordinateMutation,
  useDeleteCoordinateMutation,
} = coordinatesApi;
