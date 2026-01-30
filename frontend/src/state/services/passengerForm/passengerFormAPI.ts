import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../lib/axios/axiosBaseQuery";
import type { SubmitPassengerFormRequest, UpdatePassengerFormRequest, PassengerForm, IsFormExistsResponse } from "../../../types/passengerFormTypes";

export const passengerFormApi = createApi({
	reducerPath: "passengerFormApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getPassengerForms: builder.query<PassengerForm[], string>({
      query: (dayCardId) => ({
        url: `/passengerForm/getForms/${dayCardId}`,
        method: "GET"
      })
    }),
    getPassengerFormById: builder.query<PassengerForm, string>({
      query: (formId) => ({
        url: `/passengerForm/getFormById/${formId}`,
        method: "GET"
      })
    }),
    submitPassengerForm: builder.mutation<{ message: string; formId: string }, SubmitPassengerFormRequest>({
      query: (form) => ({
        url: "/passengerForm/submit",
        method: "POST",
        data: form
      })
    }),
    updatePassengerForm: builder.mutation<{ message: string; formId: string }, UpdatePassengerFormRequest>({
      query: (form) => ({
        url: "/passengerForm/update",
        method: "PUT",
        data: form
      })
    }),
    deletePassengerForm: builder.mutation<string, string>({
      query: (formId) => ({
        url: `/passengerForm/delete/${formId}`,
        method: "DELETE"
      })
    }),
    isFormExists: builder.query<IsFormExistsResponse, string>({
      query: (dayCardId) => ({
        url: `/passengerForm/exists/${dayCardId}`,
        method: "GET"
      })
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
