import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../../lib/axios/axiosBaseQuery';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getMe: builder.query<
      {
        _id: string;
        name: string;
        email: string;
        role: string;
        phoneNumber?: string;
        region?: string;
        description?: string;
        profileImage?: string;
        coverImage?: string;
      },
      void
    >({
      query: () => ({
        url: `/user/me`,
        method: 'GET',
      }),
    }),
    getUserDetails: builder.query<
      {
        _id: string,
        name: string,
        email: string,
        role: string,
        phoneNumber?: string,
        region?: string,
        description?: string,
        profileImage?: string,
        coverImage?: string,
      },
      string
    >({
      query: (userId) => ({
        url: `/user/getDetails/${userId}`,
        method: 'GET',
      }),
    }),
    getAllDrivers: builder.query<
      {
        _id: string;
        name: string;
        email: string;
        role: string;
        phoneNumber?: string;
        region?: string;
        description?: string;
        profileImage?: string;
        coverImage?: string;
      }[],
      void
    >({
      query: () => ({
        url: `/user/getAllDrivers`,
        method: 'GET',
      }),
    }),
    updateProfile: builder.mutation<
      {
        message: string;
        user: {
          _id: string;
          name: string;
          email: string;
          phoneNumber?: string;
          region?: string;
          description?: string;
          profileImage?: string;
          coverImage?: string;
          role: string;
        };
      },
      {
        name?: string;
        email?: string;
        phoneNumber?: string;
        region?: string;
        description?: string;
        profileImage?: string;
        coverImage?: string;
      }
    >({
      query: (body) => ({
        url: `/user/updateProfile`,
        method: 'PATCH',
        data: body,
      }),
    }),
  }),
});

export const { 
  useGetMeQuery, 
  useGetUserDetailsQuery, 
  useGetAllDriversQuery,
  useUpdateProfileMutation 
} = userApi;
