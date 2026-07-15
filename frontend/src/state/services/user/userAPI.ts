import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../../lib/axios/axiosBaseQuery';
import type { DriverDetailResponse } from '../../../types/adminTypes';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getMe: builder.query<
      {
        id: string;
        name: string;
        email: string;
        role: string;
        phoneNumber?: string;
        region?: string;
        description?: string;
        profileImage?: string;
        coverImage?: string;
        active?: boolean;
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
        id: string,
        name: string,
        email: string,
        role: string,
        phoneNumber?: string,
        region?: string,
        description?: string,
        profileImage?: string,
        coverImage?: string,
        active?: boolean,
      },
      string
    >({
      query: (userId) => ({
        url: `/user/getDetails/${userId}`,
        method: 'GET',
      }),
    }),
    getAllDrivers: builder.query<
      DriverDetailResponse[],
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
          id: string;
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
