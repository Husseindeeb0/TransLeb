import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../../lib/axios/axiosBaseQuery';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getUserDetails: builder.query<
      {
        message: string;
        data: {
          name: string;
          phone: string;
          carModel?: string;
          plateNumber?: string;
        };
      },
      string
    >({
      query: (userId) => ({
        url: `/user/getDetails/${userId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetUserDetailsQuery } = userApi;
