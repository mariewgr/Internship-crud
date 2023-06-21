import { useContext, useRef, useState } from "react";
import UsersContext from "../contexts/UsersContext";
import { Link, useParams } from "react-router-dom";
import { AppBar, Box, Button, Fab, Snackbar, Toolbar } from "@material-ui/core";
import DialogDelete from "./DialogDelete";
import FormUser from "./FormUser";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Alert } from "@mui/material";
import GrideUser from "./GridUser";
import ImageUpdate from "./ImageUpdate";
import { useTranslation } from "react-i18next";
import Langue from "./Language";

export default function UserInfo() {
  const { userId } = useParams();
  const {
    users,
    updateUser,
    loadingMap,
    errorMap,
    setOpenUpdateSuccess,
    openUpdateSuccess,
    openUpdateImageSuccess,
    openUpdateModal,
    openUpdateImageModal,
    setOpenUpdateModal,
    setOpenDeleteModal,
    openDeleteModal,
    setOpenUpdateImageSuccess,
    setOpenUpdateImageModal,
  } = useContext(UsersContext);

  const [newImage, setNewImage] = useState("");

  const user = users.find((user) => user.id === userId);

  const { t } = useTranslation();

  const refUpdate = useRef(null);
  const refDelete = useRef(null);
  const refUpdateImage = useRef(null);

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
            <Link to={"/"} style={{ color: "white" }}>
              <ArrowBackIcon />
            </Link>
          </Box>
          <Box style={{ position: "fixed", right: 5 }}>
            <Langue />
          </Box>
        </Toolbar>
      </AppBar>
      <GrideUser user={user} setNewImage={setNewImage} newImage={newImage} />

      <Fab
        color="secondary"
        className="fabEdit"
        aria-label="edit"
        style={{
          position: "fixed",
          top: 75,
          right: 155,
          color: "white",
        }}
        onClick={() => {
          setOpenUpdateModal(true);
          refUpdate.current = document.activeElement;
        }}
      >
        <EditIcon />
      </Fab>
      <Fab
        onClick={() => {
          setOpenUpdateImageModal(true);
          refUpdateImage.current = document.activeElement;
        }}
        color="secondary"
        className="edit"
        aria-label="image"
        style={{
          color: "white",
          position: "fixed",
          top: 75,
          right: 85,
        }}
      >
        <ImageIcon />
      </Fab>
      <Fab
        onClick={() => {
          setOpenDeleteModal(true);
          refDelete.current = document.activeElement;
        }}
        style={{
          position: "fixed",
          top: 75,
          right: 15,
          color: "orange",
          background: "lightgrey",
        }}
      >
        <DeleteIcon />
      </Fab>

      {openUpdateModal && (
        <FormUser
          submitAction={updateUser}
          setOpenModal={setOpenUpdateModal}
          openModal={openUpdateModal}
          isLoading={loadingMap.updateUser}
          isError={!!errorMap.updateUser}
          user={user}
          title={t("edit")}
          messageSuccess={t("updateSuccess")}
          messageError={t("noUpdate")}
          activeObject={refUpdate.current}
        />
      )}
      {openUpdateImageModal && (
        <ImageUpdate user={user} activeObject={refUpdateImage.current} />
      )}
      {openDeleteModal && (
        <DialogDelete
          openModal={openDeleteModal}
          setOpenModal={setOpenDeleteModal}
          id={userId}
          activeObject={refDelete.current}
        />
      )}

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
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openUpdateImageSuccess}
        autoHideDuration={3000}
        onClose={() => setOpenUpdateImageSuccess(false)}
      >
        <Alert
          onClose={() => setOpenUpdateImageSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {t("updateImageSuccess")}
        </Alert>
      </Snackbar>
    </>
  );
}
