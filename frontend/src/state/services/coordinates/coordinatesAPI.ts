import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../lib/axios/axiosBaseQuery";

export const coordinatesApi = createApi({
  reducerPath: "coordinatesApi",
  baseQuery: axiosBaseQuery({ baseUrl: "http://localhost:5000/api/" }),
  endpoints: (builder) => ({
    addCoordinate: builder.mutation<
      { success: boolean },
      { lat: number; lng: number }
    >({
      query: (coord) => ({
        url: "addCoordinates",
        method: "POST",
        data: coord,
      }),
    }),
  }),
});

export const { useAddCoordinateMutation } = coordinatesApi;
