import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../../lib/axios/axiosBaseQuery';

export const coordinatesApi = createApi({
  reducerPath: 'coordinatesApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Coordinates'],
  endpoints: (builder) => ({
    addCoordinate: builder.mutation<
      { success: boolean },
      { lat: number; lng: number; userId: string; dayCardId?: string }
    >({
      query: (coordinate) => ({
        url: '/coordinates/addCoordinate',
        method: 'POST',
        data: coordinate,
      }),
      invalidatesTags: ['Coordinates'],
    }),
    editCoordinate: builder.mutation<
      { success: boolean },
      { lat: number; lng: number; userId: string; dayCardId?: string }
    >({
      query: (coordinate) => ({
        url: '/coordinates/editCoordinate',
        method: 'PATCH',
        data: coordinate,
      }),
      invalidatesTags: ['Coordinates'],
    }),
    deleteCoordinate: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/coordinates/deleteCoordinate',
        method: 'DELETE',
      }),
      invalidatesTags: ['Coordinates'],
    }),
    getCoordinates: builder.query<
      {
        message: string;
        data: {
          lat: number;
          lng: number;
          userId: string;
          markedBy?: string | null;
          startTimer?: string;
          duration?: number;
        };
      } | null,
      void
    >({
      query: () => ({
        url: `/coordinates/getCoordinates`,
        method: 'GET',
      }),
      providesTags: ['Coordinates'],
    }),
    getAllCoordinates: builder.query<
      {
        message: string;
        data: {
          lat: number;
          lng: number;
          userId: string;
          markedBy?: string;
          duration?: number;
          startTimer?: string;
        }[];
      },
      string
    >({
      query: (dayCardId) => ({
        url: `/coordinates/getAllCoordinates/${dayCardId}`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ userId }) => ({ type: 'Coordinates' as const, id: userId })),
              { type: 'Coordinates', id: 'LIST' },
            ]
          : [{ type: 'Coordinates', id: 'LIST' }],
    }),
  }),
});

export const {
  useAddCoordinateMutation,
  useEditCoordinateMutation,
  useDeleteCoordinateMutation,
  useGetCoordinatesQuery,
  useGetAllCoordinatesQuery,
} = coordinatesApi;
