import { useContext, useEffect } from "react";
import { User } from "../App";
import { Link, useParams } from "react-router-dom";
import "./UserInfo.css";
import useLocalStore, { StoreConfig } from "state-decorator";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import { AppBar, Box, Button, Fab, Grid, Toolbar } from "@material-ui/core";
import dayjs, { Dayjs } from "dayjs";
import DialogDelete from "./DialogDelete";
import FormUser from "./FormUser";
import { UserContext } from "./UserRow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const initUser = {
  id: "",
  firstName: "",
  lastName: "",
  birthdate: null,
  imageUrl: "",
};

export type Actions = {
  setUser: (user: User) => void;
  setOpenDelete: (open: boolean) => void;
  setOpenUpdate: (open: boolean) => void;
  loadUser: (userId: string | undefined) => Promise<User>;
  deleteUser: (userId: string | undefined) => Promise<unknown>;
  updateUser: (
    userId: string | undefined,
    firstName: string,
    lastName: string,
    birthdate: Dayjs | null,
    imageUrl: string
  ) => Promise<User>;
};

export type State = { user: User; openDelete: boolean; openUpdate: boolean };

export const config: StoreConfig<State, Actions> = {
  getInitialState: () => ({
    user: initUser,
    openDelete: false,
    openUpdate: false,
  }),

  actions: {
    setUser: ({ args: [user] }) => ({ user }),
    setOpenDelete: ({ args: [openDelete] }) => ({ openDelete }),
    setOpenUpdate: ({ args: [openUpdate] }) => ({ openUpdate }),
    loadUser: {
      getPromise: ({ args: [userId] }) =>
        fetch(`http://localhost:3050/api/users/${userId}`).then((res) =>
          res.ok ? res.json() : Promise.reject()
        ),
      effects: ({ res }) => ({ user: res }),
    },
    deleteUser: {
      getPromise: ({ args: [userId] }) =>
        fetch(`http://localhost:3050/api/users/${userId}`, {
          method: "DELETE",
        }).then((res) => (res.ok ? res.json() : Promise.reject())),
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
      effects: ({ res }) => {
        return { user: res };
      },
      sideEffects: ({ a }) => {
        a.setOpenUpdate(false);
      },
    },
  },
  logEnabled: true,
};

export default function UserInfo() {
  const { state: s, actions, loadingMap, errorMap } = useLocalStore(config);
  const { userId } = useParams();
  const user = useContext(UserContext);

  useEffect(() => {
    if (userId) {
      actions.loadUser(userId);
    }
  }, []);

  return (
    <>
      {loadingMap.loadUser || loadingMap.updateUser ? (
        <LoadingPage />
      ) : errorMap.loadUser ? (
        <ErrorPage onRetry={() => actions.loadUser(userId)} />
      ) : (
        <>
          <AppBar component="nav">
            <Toolbar>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Link to={"/"} style={{ color: "#fff" }}>
                  Home
                </Link>
              </Box>
            </Toolbar>
          </AppBar>
          <Toolbar id="back-to-top-anchor" />
          <dl>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              direction="column"
              spacing={4}
            >
              <Grid container item direction="row">
                <Grid item xs={6}>
                  <dt>User Id:</dt>
                </Grid>
                <Grid item xs={6}>
                  <dd>{user.id}</dd>
                </Grid>
              </Grid>
              <Grid container item direction="row">
                <Grid item xs={6}>
                  <dt>Firstname:</dt>
                </Grid>
                <Grid item xs={6}>
                  <dd>{user.firstName}</dd>
                </Grid>
              </Grid>
              <Grid container item direction="row">
                <Grid item xs={6}>
                  <dt>Lastname:</dt>
                </Grid>
                <Grid item xs={6}>
                  <dd>{user.lastName}</dd>
                </Grid>
              </Grid>
              <Grid container item direction="row">
                <Grid item xs={6}>
                  <dt>Birthday:</dt>
                </Grid>
                <Grid item xs={6}>
                  <dd>
                    {user.birthdate !== null ? (
                      <div>
                        {dayjs(s.user.birthdate).format("DD-MMMM-YYYY")}
                      </div>
                    ) : (
                      <div>No Birthdate registered</div>
                    )}
                  </dd>
                </Grid>
              </Grid>
              <Grid container item direction="row">
                <Grid item xs={6}>
                  <dt>Image:</dt>
                </Grid>
                <Grid item xs={6}>
                  <dd>
                    <img src={user.imageUrl}></img>
                  </dd>
                </Grid>
              </Grid>
            </Grid>
            <Fab
              color="primary"
              aria-label="delete"
              style={{ position: "fixed", bottom: 16, left: 16 }}
            >
              <Button
                onClick={() => actions.setOpenDelete(true)}
                style={{ color: "#fff" }}
              >
                <DeleteIcon />
              </Button>
            </Fab>
            <DialogDelete
              isError={errorMap.deleteUser}
              isLoading={loadingMap.deleteUser}
              open={s.openDelete}
              setOpen={actions.setOpenDelete}
              deleteUser={actions.deleteUser}
              id={user.id}
            />
            <Fab
              color="primary"
              aria-label="edit"
              style={{ position: "fixed", bottom: 16, right: 16 }}
            >
              <Button
                onClick={() => actions.setOpenUpdate(true)}
                style={{ color: "#fff" }}
              >
                <EditIcon />
              </Button>
            </Fab>
            <FormUser
              action={actions.updateUser}
              showModal={actions.setOpenUpdate}
              open={s.openUpdate}
              id={user.id}
              isLoading={loadingMap.updateUser}
              isError={errorMap.updateUser}
              user={user}
              title="Edit User"
            />
          </dl>
        </>
      )}
    </>
  );
}
