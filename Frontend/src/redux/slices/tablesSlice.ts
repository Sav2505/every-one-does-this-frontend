// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { IConfession, IPostConfession } from "../../interfaces/interfaces";
// import { CONFIG_API } from "../../configs";

// // const BASE_URL = `${CONFIG_API.BASE_URL}:${CONFIG_API.SERVER_PORT}/${CONFIG_API.TABLES_ROUTER}`;
// const BASE_URL = `${CONFIG_API.BASE_URL}/${CONFIG_API.TABLES_ROUTER}`;

// export const tablesApiSlice = createApi({
//   reducerPath: "confessions",
//   baseQuery: fetchBaseQuery({
//     baseUrl: BASE_URL,
//   }),
//   tagTypes: ["Confessions"],
//   endpoints: (builder) => {
//     return {
//       getConfessionsAPI: builder.query<IConfession[], void>({
//         query: () => "/get-confessions",
//         providesTags: ["Confessions"],
//       }),

//       postConfession: builder.mutation<IConfession, IPostConfession>({
//         query: (newConfession) => ({
//           url: "/post-confession",
//           method: "POST",
//           body: newConfession,
//         }),
//         invalidatesTags: ["Confessions"],
//       }),

//     };
//   },
// });

// export const { useGetConfessionsAPIQuery, usePostConfessionMutation } = tablesApiSlice;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IConfession, IPostConfession } from "../../interfaces/interfaces";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://every-one-does-this-backend.onrender.com";

export const tablesApiSlice = createApi({
  reducerPath: "confessions",
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/tables` }),
  tagTypes: ["Confessions"],
  endpoints: (builder) => ({
    getConfessionsAPI: builder.query<IConfession[], void>({
      query: () => "/get-confessions",
      providesTags: ["Confessions"],
    }),
    postConfession: builder.mutation<IConfession, IPostConfession>({
      query: (newConfession) => ({
        url: "/post-confession",
        method: "POST",
        body: newConfession,
      }),
      invalidatesTags: ["Confessions"],
    }),
  }),
});

export const { useGetConfessionsAPIQuery, usePostConfessionMutation } = tablesApiSlice;
