import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../lib/axios/axiosBaseQuery";
import type { passengerFormType } from "../../../types/passengerFormTypes";

export const passengerFormApi = createApi({
	reducerPath: "passengerFormApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getPassengerForms: builder.query<passengerFormType[], void>({
      query: () => ({
        url: "/passengerForm/getPassengerForms",
        method: "GET"
      })
    }),
    getPassengerFormById: builder.query<passengerFormType, string>({
      query: (id) => ({
        url: `/passengerForm/getPassengerFormById/${id}`,
        method: "GET"
      })
    }),
    submitPassengerForm: builder.mutation<string, passengerFormType>({
      query: (form) => ({
        url: "/passengerForm/submit",
        method: "POST",
        data: form
      })
    }),
    updatePassengerForm: builder.mutation<string, passengerFormType>({
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
    })
  })
})