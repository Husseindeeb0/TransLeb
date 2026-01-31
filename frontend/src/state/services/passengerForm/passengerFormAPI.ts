import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../lib/axios/axiosBaseQuery";
import type { SubmitPassengerFormRequest, UpdatePassengerFormRequest, PassengerForm, IsFormExistsResponse } from "../../../types/passengerFormTypes";

export const passengerFormApi = createApi({
	reducerPath: "passengerFormApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["PassengerForm"],
  endpoints: (builder) => ({
    getPassengerForms: builder.query<{ message: string; data: PassengerForm[] }, string>({
      query: (dayCardId) => ({
        url: `/passengerForm/getForms/${dayCardId}`,
        method: "GET"
      }),
      providesTags: (result) => 
        result 
          ? [...result.data.map(({ _id }) => ({ type: "PassengerForm" as const, id: _id })), { type: "PassengerForm", id: "LIST" }]
          : [{ type: "PassengerForm", id: "LIST" }]
    }),
    getPassengerFormById: builder.query<PassengerForm, string>({
      query: (formId) => ({
        url: `/passengerForm/getFormById/${formId}`,
        method: "GET"
      }),
      providesTags: (_result, _error, id) => [{ type: "PassengerForm", id }]
    }),
    submitPassengerForm: builder.mutation<{ message: string; formId: string }, SubmitPassengerFormRequest>({
      query: (form) => ({
        url: "/passengerForm/submit",
        method: "POST",
        data: form
      }),
      invalidatesTags: [{ type: "PassengerForm", id: "LIST" }]
    }),
    updatePassengerForm: builder.mutation<{ message: string; formId: string }, UpdatePassengerFormRequest>({
      query: (form) => ({
        url: "/passengerForm/update",
        method: "PUT",
        data: form
      }),
      invalidatesTags: (_result, _error, { formId }) => [
        { type: "PassengerForm", id: formId },
        { type: "PassengerForm", id: "LIST" }
      ]
    }),
    deletePassengerForm: builder.mutation<string, string>({
      query: (formId) => ({
        url: `/passengerForm/delete/${formId}`,
        method: "DELETE"
      }),
      invalidatesTags: [{ type: "PassengerForm", id: "LIST" }]
    }),
    isFormExists: builder.query<IsFormExistsResponse, string>({
      query: (dayCardId) => ({
        url: `/passengerForm/exists/${dayCardId}`,
        method: "GET"
      }),
      providesTags: (result) => result?.exists ? [{ type: "PassengerForm", id: "EXISTS" }] : []
    })
  })
});

export const {
  useGetPassengerFormsQuery,
  useGetPassengerFormByIdQuery,
  useSubmitPassengerFormMutation,
  useUpdatePassengerFormMutation,
  useDeletePassengerFormMutation,
  useIsFormExistsQuery,
} = passengerFormApi;
