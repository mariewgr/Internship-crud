import {
  useLocalStore,
  StoreConfig,
  LoadingMap,
  ErrorMap,
} from "state-decorator";
import { createContext, useEffect } from "react";
import { setArgIn } from "state-decorator/helpers";
import { Dayjs } from "dayjs";

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
  setOpenDeleteSuccess: (openDeleteSucces: boolean) => void;
  setPage: (page: number) => void;
};

export type UsersListActions = Actions;

export type State = {
  users: User[];
  openCreate: boolean;
  openDeleteSucces: boolean;
  page: number;
};

export type UsersState = State;

// Initial state & actions
export const config: StoreConfig<State, Actions> = {
  getInitialState: () => ({
    users: [],
    openCreate: false,
    openDeleteSucces: false,
    page: 1,
  }),

  actions: {
    setUsers: setArgIn("users"), //({ args: [users] }) => ({ users }),
    setOpenDeleteSuccess: setArgIn("openDeleteSucces"),
    setPage: setArgIn("page"),
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
      effects: ({ s, args: [userId] }) => {
        const newUsers = [...s.users];
        return {
          users: newUsers.filter((user) => user.id !== userId),
        };
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
        a.setPage(1);
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
      effects: ({ s, args: [userId], res }) => {
        const newUsers = [...s.users];
        const index = newUsers.findIndex((user) => user.id === userId);
        newUsers[index] = res;
        return { users: newUsers };
      },
    },
  },
  logEnabled: true,
};

type UsersContextProps = State &
  Actions & {
    loadingMap: LoadingMap<Actions>;
    errorMap: ErrorMap<Actions>;
  };

export const UsersContext = createContext<UsersContextProps>(null);

export function UsersContextProvider(p: { children: JSX.Element }) {
  const { state: s, actions: a, loadingMap, errorMap } = useLocalStore(config);

  useEffect(() => {
    a.loadUsers();
  }, []);

  return (
    <UsersContext.Provider value={{ ...s, ...a, loadingMap, errorMap }}>
      {p.children}
    </UsersContext.Provider>
  );
}

export default UsersContext;
