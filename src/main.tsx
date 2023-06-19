import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserInfo from "./components/UserInfos.tsx";
import { UsersContextProvider } from "./contexts/UsersContext.tsx";
import { createTheme, ThemeProvider } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";

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
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UsersContextProvider>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </UsersContextProvider>
  </React.StrictMode>
);
