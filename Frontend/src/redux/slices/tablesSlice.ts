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

import {
  createApi,
  QueryReturnValue,
} from "@reduxjs/toolkit/query/react";
import { IConfession, IPostConfession } from "../../interfaces/interfaces";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ehlafdwgnadqtdpxxiwc.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export const tablesApiSlice = createApi({
  reducerPath: "confessions",
  baseQuery: async () => ({ data: [] }),
  tagTypes: ["Confessions"],
  endpoints: (builder) => ({
    getConfessionsAPI: builder.query<IConfession[], void>({
      async queryFn(): Promise<QueryReturnValue<IConfession[], unknown>> {
        const { data, error } = await supabase
          //@ts-ignore
          .from<IConfession>("confessions")
          .select("*");

        if (error) {
          return { error };
        }
        return { data: data || [] };
      },
      providesTags: ["Confessions"],
    }),
    postConfession: builder.mutation<IConfession, IPostConfession>({
      async queryFn(
        newConfession: IPostConfession
      ): Promise<QueryReturnValue<IConfession, unknown>> {
        const { data, error } = await supabase
          //@ts-ignore
          .from<IConfession>("confessions")
          .insert([newConfession]);

        if (error) {
          return { error };
        }
        return { data: data ? data[0] : (null as any) };
      },
      invalidatesTags: ["Confessions"],
    }),
  }),
});

export const { useGetConfessionsAPIQuery, usePostConfessionMutation } =
  tablesApiSlice;
