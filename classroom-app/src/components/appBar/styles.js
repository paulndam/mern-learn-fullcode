import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: "#8e8e8e",
      main: "#ff4400",
      dark: "#373737",
      contrastText: "#fffde7",
    },
    secondary: {
      light: "#484848",
      main: "#000000",
      dark: "#000000",
      contrastText: "#ffcc00",
    },

    contrastThreshold: 3,
    tonalOffset: 0.2,
    openTitle: "#455a64",
    protectedTitle: "#f57c00",
    type: "light",
  },
});

export default theme;
