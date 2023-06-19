import { useContext } from "react";
import UsersContext from "../contexts/UsersContext";
import { Link, useParams } from "react-router-dom";
import "./UserInfo.css";
import { AppBar, Box, Button, Fab, Snackbar, Toolbar } from "@material-ui/core";
import DialogDelete from "./DialogDelete";
import FormUser from "./FormUser";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Alert } from "@mui/material";
import useLocalStore, { StoreConfig } from "state-decorator";
import { setArgIn } from "state-decorator/helpers";
import GrideUser from "./GridUser";
import ImageUpdate from "./ImageUpdate";
import { useTranslation } from "react-i18next";
import Langue from "./Langue";

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
  const {
    users,
    updateUser,
    loadingMap,
    errorMap,
    setOpenDeleteSuccess,
    setOpenUpdateSuccess,
    openUpdateSuccess,
  } = useContext(UsersContext);

  const { state: s, actions: a } = useLocalStore(configUserInfo);

  const user = users.find((user) => user.id === userId);

  const { t } = useTranslation();

  return (
    <>
      <AppBar component="nav">
        <Toolbar>
          <Box
            sx={{
              display: { xs: "none", sm: "block" },
              justifyContent: "center",
              justifyItems: "center",
            }}
          >
            <Link to={"/"} style={{ color: "#fff" }}>
              <ArrowBackIcon />
            </Link>
          </Box>
          <Box style={{ position: "fixed", right: 5 }}>
            <Langue />
          </Box>
        </Toolbar>
      </AppBar>
      {errorMap.deleteUser && <Alert severity="error">{t("noDelete")}</Alert>}
      <GrideUser
        user={user}
        setNewImage={a.setNewImage}
        newImage={s.newImage}
      />
      <Button
        onClick={() => a.setOpenDelete(true)}
        style={{
          borderRadius: 150,
          width: 55,
          height: 55,
          position: "fixed",
          top: 75,
          right: 155,
          color: "orange",
        }}
        color="secondary"
        variant="outlined"
      >
        <DeleteIcon />
      </Button>
      <DialogDelete open={s.openDelete} setOpen={a.setOpenDelete} id={userId} />
      <Button
        onClick={() => a.setOpenUpdate(true)}
        style={{
          borderRadius: 150,
        }}
      >
        <Fab
          color="secondary"
          className="fabEdit"
          aria-label="edit"
          style={{
            position: "fixed",
            top: 75,
            right: 15,
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
        isError={!!errorMap.updateUser}
        user={user}
        title={t("edit")}
        messageSuccess={t("updateSuccess")}
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openUpdateSuccess}
        autoHideDuration={3000}
        onClose={() => setOpenUpdateSuccess(false)}
      >
        <Alert
          onClose={() => setOpenUpdateSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {t("updateSuccess")}
        </Alert>
      </Snackbar>
      <ImageUpdate
        openImage={s.openImage}
        setOpenImage={a.setOpenImage}
        user={user}
      />
    </>
  );
}
