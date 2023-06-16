import HomePage from "./components/HomePage";
import UsersContext from "./contexts/UsersContext";
import { useContext } from "react";
import { Alert, LinearProgress } from "@mui/material";

function App() {
  const { loadingMap, errorMap } = useContext(UsersContext);

  return (
    <>
      {loadingMap.loadUsers && (
        <div style={{ justifyContent: "center", justifyItems: "center" }}>
          {" "}
          <LinearProgress />
        </div>
      )}
      {errorMap.loadUsers && (
        <div style={{ justifyContent: "center", justifyItems: "center" }}>
          {" "}
          <Alert severity="error">Error Loading</Alert>
        </div>
      )}
      <HomePage />
    </>
  );
}

export default App;
