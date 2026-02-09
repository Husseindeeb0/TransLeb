import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../../lib/axios/axiosBaseQuery';

export const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    sendContactEmail: builder.mutation({
      query: (data) => ({
        url: '/contact',
        method: 'POST',
        data,
      }),
    }),
  }),
});

export const { useSendContactEmailMutation } = contactApi;
