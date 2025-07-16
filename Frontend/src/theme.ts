import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
  },
  components: {
    MuiTouchRipple: {
      styleOverrides: {
        root: {
          animationDuration: "100ms",
        },
      },
    },
  },
});

export default theme;
