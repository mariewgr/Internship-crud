import LoadingPage from "./components/LoadingPage";
import ErrorPage from "./components/ErrorPage";
import HomePage from "./components/HomePage";
import UsersContext from "./contexts/UsersContext";
import { useContext } from "react";

function App() {
  const { loadUsers, loadingMap, errorMap } = useContext(UsersContext);

  return (
    <>
      {errorMap.loadUsers ? (
        <ErrorPage onRetry={loadUsers} />
      ) : loadingMap.loadUsers ? (
        <LoadingPage />
      ) : (
        <HomePage />
      )}
    </>
  );
}

export default App;
