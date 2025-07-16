import { configureStore } from "@reduxjs/toolkit";
import { tablesApiSlice } from "./slices/tablesSlice";

export const store = configureStore({
  reducer: {
    [tablesApiSlice.reducerPath]: tablesApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(tablesApiSlice.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
