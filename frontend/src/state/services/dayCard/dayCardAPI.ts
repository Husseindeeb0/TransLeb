import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../lib/axios/axiosBaseQuery";
import type { DayCard, CreateDayCardRequest, UpdateDayCardRequest } from "../../../types/dayCardTypes";

export const dayCardApi = createApi({
  reducerPath: "dayCardApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["DayCard"],
  endpoints: (builder) => ({
    getDayCards: builder.query<DayCard[], void>({
      query: () => ({
        url: "/dayCard/getDayCards",
        method: "GET"
      }),
      providesTags: ["DayCard"]
    }),
    getDayCardById: builder.query<DayCard, string>({
      query: (id) => ({
        url: `/dayCard/getDayCardById/${id}`,
        method: "GET"
      }),
      providesTags: (result, error, id) => [{ type: "DayCard", id }]
    }),
    createDayCard: builder.mutation<DayCard, CreateDayCardRequest>({
      query: (dayCard) => ({
        url: "/dayCard/create",
        method: "POST",
        data: dayCard
      }),
      invalidatesTags: ["DayCard"]
    }),
    updateDayCard: builder.mutation<DayCard, UpdateDayCardRequest>({
      query: (dayCard) => ({
        url: `/dayCard/update/${dayCard.dayCardId}`,
        method: "PATCH",
        data: dayCard
      }),
      invalidatesTags: (result, error, dayCard) => [{ type: "DayCard", id: dayCard.dayCardId }, "DayCard"]
    }),
    deleteDayCard: builder.mutation<string, string>({
      query: (dayCardId) => ({
        url: `/dayCard/delete/${dayCardId}`,
        method: "DELETE"
      }),
      invalidatesTags: ["DayCard"]
    })
  })
});

export const {
  useGetDayCardsQuery,
  useGetDayCardByIdQuery,
  useCreateDayCardMutation,
  useUpdateDayCardMutation,
  useDeleteDayCardMutation
} = dayCardApi;