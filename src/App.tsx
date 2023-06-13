import "./App.css";
import { useLocalStore, StoreConfig } from "state-decorator";
import { createContext, useEffect } from "react";
import LoadingPage from "./components/LoadingPage";
import ErrorPage from "./components/ErrorPage";
import "./App.css";
import { setArgIn } from "state-decorator/helpers";
import { Dayjs } from "dayjs";
import { Pagination } from "@mui/material";
import HomePage from "./components/HomePage";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  birthdate: Dayjs | null;
  imageUrl: string;
};

export type Response = { total: number; users: User[]; count: number };

type Actions = {
  setUsers: (users: User[]) => void;
  showCreateModal: (open: boolean) => void;
  loadUsers: () => Promise<Response>;
  deleteUser: (userId: string | undefined) => Promise<unknown>;
  createUser: (
    id: string,
    firstName: string,
    lastName: string,
    birthdate: Dayjs | null,
    imageUrl: string
  ) => Promise<User>;
  updateUser: (
    userId: string | undefined,
    firstName: string,
    lastName: string,
    birthdate: Dayjs | null,
    imageUrl: string
  ) => Promise<User>;
};

export type UsersListActions = Actions;

export type State = {
  users: User[];
  openCreate: boolean;
};

export type UserState = State;

// Initial state & actions
export const config: StoreConfig<State, Actions> = {
  getInitialState: () => ({
    users: [],
    openCreate: false,
  }),

  actions: {
    setUsers: setArgIn("users"), //({ args: [users] }) => ({ users }),
    loadUsers: {
      getPromise: () =>
        fetch("http://localhost:3050/api/users?limit=100").then((res) =>
          res.ok ? res.json() : Promise.reject(new Error("didn't load"))
        ),
      effects: ({ res }) => ({ users: res.users }),
    },
    deleteUser: {
      getPromise: ({ args: [userId] }) =>
        fetch(`http://localhost:3050/api/users/${userId}`, {
          method: "DELETE",
        }).then((res) =>
          res.ok ? res.json() : Promise.reject(new Error("didn't delete"))
        ),
      sideEffects: ({ a }) => {
        a.loadUsers(); // TO CHANGE
      },
    },
    showCreateModal: ({ args: [openCreate] }) => ({ openCreate }),
    createUser: {
      getPromise: ({ args: [_id, firstName, lastName, birthdate, imageUrl] }) =>
        fetch(`http://localhost:3050/api/users`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ firstName, lastName, birthdate, imageUrl }),
        }).then((res) =>
          res.ok ? res.json() : Promise.reject(new Error("didn't create"))
        ),
      effects: ({ s, res }) => {
        return { users: [res].concat(s.users) };
      },
      sideEffects: ({ a }) => {
        a.showCreateModal(false);
      },
    },
    updateUser: {
      getPromise: ({ args: [id, firstName, lastName, birthdate, imageUrl] }) =>
        fetch(`http://localhost:3050/api/users/${id}`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ firstName, lastName, birthdate, imageUrl }),
        }).then((res) =>
          res.ok ? res.json() : Promise.reject(new Error("didn't create"))
        ),
      sideEffects: ({ a }) => {
        a.loadUsers(); //TO CHANGE
      },
    },
  },
  logEnabled: true,
};

export const UsersContext = createContext<User[]>([]);

function App() {
  const { state: s, actions, loadingMap, errorMap } = useLocalStore(config);

  useEffect(() => {
    actions.loadUsers();
  }, []);

  return (
    <UsersContext.Provider value={s.users}>
      {errorMap.loadUsers ? (
        <ErrorPage onRetry={actions.loadUsers} />
      ) : loadingMap.loadUsers ? (
        <LoadingPage />
      ) : (
        <>
          <HomePage
            loadingMap={loadingMap}
            errorMap={errorMap}
            users={s.users}
            createUser={actions.createUser}
            showCreateModal={actions.showCreateModal}
            openCreate={s.openCreate}
            deleteUser={actions.deleteUser}
            updateUser={actions.updateUser}
          />
          {/* <Pagination count={10} color="primary" /> */}
        </>
      )}
    </UsersContext.Provider>
  );
}

export default App;