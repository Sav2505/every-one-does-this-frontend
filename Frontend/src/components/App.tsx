import "./app.css";
import React from "react";
import { CONFIG_API } from "../configs";
import { ControlPage } from "./pages/ControlPage";
import { MainPage } from "./pages/MainPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import theme from "../theme";
import { MobilePage } from "./pages/MobilePage";

export const App = () => {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path={String(CONFIG_API.MAIN_PAGE)} element={<MainPage />} />
            <Route
              path={String(CONFIG_API.CONTROL_PAGE)}
              element={<ControlPage />}
            />
            <Route
              path={String(CONFIG_API.MOBILE_PAGE)}
              element={<MobilePage />}
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </React.StrictMode>
  );
};
