import { useContext } from "react";
import UsersContext from "../contexts/UsersContext";
import { Link, useParams } from "react-router-dom";
import "./UserInfo.css";
import {
  AppBar,
  Box,
  Button,
  Fab,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import DialogDelete from "./DialogDelete";
import FormUser from "./FormUser";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Alert } from "@mui/material";
import useLocalStore, { StoreConfig } from "state-decorator";
import { setArgIn } from "state-decorator/helpers";
import GrideUser from "./GridUser";

type Actions = {
  setOpenDelete: (openDelete: boolean) => void;
  setOpenUpdate: (openUpdate: boolean) => void;
  setNewImage: (newImage: string) => void;
  setOpenImage: (openImage: boolean) => void;
};

export type UserInfosActions = Actions;

type State = {
  openDelete: boolean;
  openUpdate: boolean;
  newImage: string;
  openImage: boolean;
};

export type UserInfosState = State;
// Initial state & actions
export const configUserInfo: StoreConfig<State, Actions> = {
  getInitialState: () => ({
    openDelete: false,
    openUpdate: false,
    openImage: false,
    newImage: "",
  }),

  actions: {
    setOpenDelete: setArgIn("openDelete"),
    setOpenUpdate: setArgIn("openUpdate"),
    setNewImage: setArgIn("newImage"),
    setOpenImage: setArgIn("openImage"),
  },
  logEnabled: true,
};
export default function UserInfo() {
  const { userId } = useParams();
  const { users, updateUser, loadingMap, errorMap, deleteUser } =
    useContext(UsersContext);

  const { state: s, actions: a } = useLocalStore(configUserInfo);

  const user = users.find((user) => user.id === userId);

  return (
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
      {errorMap.deleteUser && (
        <Alert severity="error">This is an error alert — check it out!</Alert>
      )}
      <GrideUser
        user={user}
        setNewImage={a.setNewImage}
        setOpenImage={a.setOpenImage}
        newImage={s.newImage}
        openImage={s.openImage}
      />
      <Button
        onClick={() => a.setOpenDelete(true)}
        style={{ borderRadius: 150 }}
      >
        <Fab
          color="secondary"
          aria-label="delete"
          style={{ position: "fixed", top: 75, right: 86 }}
        >
          <DeleteIcon />
        </Fab>
      </Button>
      <DialogDelete
        open={s.openDelete}
        setOpen={a.setOpenDelete}
        id={userId}
        action={deleteUser}
      />
      <Button
        onClick={() => a.setOpenUpdate(true)}
        style={{
          borderRadius: 150,
        }}
      >
        <Fab
          className="fabEdit"
          aria-label="edit"
          style={{
            position: "fixed",
            top: 75,
            right: 16,
            background: "orange",
            color: "white",
          }}
        >
          <EditIcon />
        </Fab>
      </Button>
      <FormUser
        action={updateUser}
        showModal={a.setOpenUpdate}
        open={s.openUpdate}
        isLoading={loadingMap.updateUser}
        isError={errorMap.updateUser}
        user={user}
        title="Edit User"
      />
    </>
  );
}
