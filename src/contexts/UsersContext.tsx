import {
  useLocalStore,
  StoreConfig,
  LoadingMap,
  ErrorMap,
} from "state-decorator";
import { createContext, useEffect } from "react";
import { setArgIn } from "state-decorator/helpers";
import dayjs, { Dayjs } from "dayjs";
import { Language } from "../translate/Language";

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
  setOpenCreateModal: (openCreateModal: boolean) => void;
  setOpenUpdateModal: (openUpdateModal: boolean) => void;
  setOpenUpdateImageModal: (openUpdateModal: boolean) => void;
  setOpenDeleteModal: (openDeleteModal: boolean) => void;
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
  setOpenCreateSuccess: (openCreateSucces: boolean) => void;
  setOpenUpdateSuccess: (openUpdateSucces: boolean) => void;
  setOpenUpdateImageSuccess: (openUpdateSucces: boolean) => void;
  setPage: (page: number) => void;
  setLanguage: (language: Language) => void;
};

export type UsersListActions = Actions;

export type State = {
  users: User[];
  openCreateModal: boolean;
  openDeleteModal: boolean;
  openUpdateModal: boolean;
  openUpdateImageModal: boolean;
  openDeleteSuccess: boolean;
  openCreateSuccess: boolean;
  openUpdateSuccess: boolean;
  openUpdateImageSuccess: boolean;
  page: number;
  language: Language;
};

export type UsersState = State;

// Initial state & actions
export const config: StoreConfig<State, Actions> = {
  getInitialState: () => ({
    users: [],
    openCreateModal: false,
    openDeleteModal: false,
    openUpdateModal: false,
    openUpdateImageModal: false,
    openDeleteSuccess: false,
    openCreateSuccess: false,
    openUpdateSuccess: false,
    openUpdateImageSuccess: false,
    page: 1,
    language: Language.FR,
  }),

  actions: {
    setUsers: setArgIn("users"), //({ args: [users] }) => ({ users }),
    setOpenDeleteSuccess: setArgIn("openDeleteSuccess"),
    setOpenUpdateSuccess: setArgIn("openUpdateSuccess"),
    setOpenUpdateImageSuccess: setArgIn("openUpdateImageSuccess"),
    setOpenCreateSuccess: setArgIn("openCreateSuccess"),
    setPage: setArgIn("page"),
    setLanguage: setArgIn("language"),
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
    setOpenCreateModal: setArgIn("openCreateModal"),
    setOpenDeleteModal: setArgIn("openDeleteModal"),
    setOpenUpdateModal: setArgIn("openUpdateModal"),
    setOpenUpdateImageModal: setArgIn("openUpdateImageModal"),
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
        a.setOpenCreateModal(false);
        a.setPage(1);
        a.setOpenCreateSuccess(true);
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
          res.ok ? res.json() : Promise.reject(new Error("didn't update"))
        ),
      effects: ({ s, args: [userId], res }) => {
        const newUsers = [...s.users];
        const index = newUsers.findIndex((user) => user.id === userId);
        newUsers[index] = res;
        return { users: newUsers };
      },
      sideEffects: ({ a }) => {
        a.setOpenUpdateModal(false);
        a.setOpenUpdateSuccess(true);
      },
    },
  },
  onMount: () => dayjs.locale("fr"),
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
