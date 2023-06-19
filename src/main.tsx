import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserInfo from "./components/UserInfos.tsx";
import { UsersContextProvider } from "./contexts/UsersContext.tsx";
import { createTheme, ThemeProvider } from "@material-ui/core";
import { blue, red } from "@material-ui/core/colors";
import "./translate/translate.tsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/fr";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "user/:userId",
    element: <UserInfo />,
  },
]);

const theme = createTheme({
  palette: {
    primary: {
      main: blue[800],
      dark: blue[900],
    },
    secondary: {
      main: "#ffa500",
      dark: "#FF8C00",
    },
    error: {
      main: red[200],
      dark: red[500],
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <UsersContextProvider>
          <RouterProvider router={router} />
        </UsersContextProvider>
      </ThemeProvider>
    </LocalizationProvider>
  </React.StrictMode>
);
