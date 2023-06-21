import HomePage from "./HomePage";
import UsersContext from "../contexts/UsersContext";
import { useContext } from "react";
import { Alert, LinearProgress } from "@mui/material";
import { useTranslation } from "react-i18next";

function App() {
  const { loadingMap, errorMap } = useContext(UsersContext);

  const { t } = useTranslation();

  return (
    <>
      {loadingMap.loadUsers && (
        <div>
          {" "}
          <LinearProgress />
        </div>
      )}
      {errorMap.loadUsers && (
        <div style={{ justifyContent: "center", justifyItems: "center" }}>
          <Alert severity="error">{t("errorLoading")}</Alert>
        </div>
      )}
      <HomePage />
    </>
  );
}

export default App;
