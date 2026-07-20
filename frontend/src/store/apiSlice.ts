import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  }),
  tagTypes: ['Page', 'Auth'],
  endpoints: (builder) => ({
    getPages: builder.query<any[], void>({
      query: () => '/content',
      providesTags: ['Page'],
    }),
    getPageBySlug: builder.query<any, string>({
      query: (slug) => `/content/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Page', id: slug }],
    }),
    register: builder.mutation<any, any>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    login: builder.mutation<any, any>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    createPage: builder.mutation<any, any>({
      query: (pageData) => ({
        url: '/content',
        method: 'POST',
        body: pageData,
      }),
      invalidatesTags: ['Page'],
    }),
    updatePage: builder.mutation<any, { id: string, pageData: any }>({
      query: ({ id, pageData }) => ({
        url: `/content/${id}`,
        method: 'PUT',
        body: pageData,
      }),
      invalidatesTags: ['Page'],
    }),
  }),
});

export const {
  useGetPagesQuery,
  useGetPageBySlugQuery,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useCreatePageMutation,
  useUpdatePageMutation
} = apiSlice;
