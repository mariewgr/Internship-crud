import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserInfo from "./components/UserInfos.tsx";
import { UsersContextProvider } from "./contexts/UsersContext.tsx";

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

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UsersContextProvider>
      <RouterProvider router={router} />
    </UsersContextProvider>
  </React.StrictMode>
);
