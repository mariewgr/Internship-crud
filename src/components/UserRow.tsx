import { TableRow, TableCell, IconButton, Snackbar } from "@material-ui/core";
import UsersContext, { User } from "../contexts/UsersContext";
import { Link } from "react-router-dom";

import { createContext, useContext, useState } from "react";
import DialogDelete from "./DialogDelete";
import FormUser from "./FormUser";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import "./UserRow.css";
import { useTranslation } from "react-i18next";
import { Alert } from "@mui/material";

type UserRowProps = {
  user: User;
};

const initUser: User = {
  id: "",
  firstName: "",
  lastName: "",
  birthdate: null,
  imageUrl: "",
};

export const UserContext = createContext<User>(initUser);

export default function UserRow(p: UserRowProps) {
  const { user } = p;
  const {
    updateUser,
    loadingMap,
    errorMap,
    setOpenDeleteSuccess,
    openDeleteSuccess,
    setOpenUpdateSuccess,
    openUpdateSuccess,
    openUpdate,
    showUpdateModal,
  } = useContext(UsersContext);
  const [openDelete, setDeleteOpen] = useState(false);
  const [openUpdateLocal, setUpdateOpen] = useState(false);

  const { t } = useTranslation();

  return (
    <UserContext.Provider value={user}>
      <TableRow key={user.id}>
        <TableCell align="center" component="th" scope="user">
          <Link to={`user/${user.id}`} className="link">
            {user.firstName + " " + user.lastName}
          </Link>
        </TableCell>
        <TableCell align="center">
          {user.birthdate !== null ? (
            <div>{dayjs(user.birthdate).format("LL")}</div>
          ) : (
            <div> {t("noBirthdate")}</div>
          )}
        </TableCell>
        <TableCell
          align="center"
          style={{ display: "flex", justifyContent: "space-evenly" }}
        >
          <>
            <IconButton
              aria-label="delete"
              onClick={() => setDeleteOpen(true)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>

            <IconButton
              aria-label="edit"
              onClick={() => {
                setUpdateOpen(true);
                showUpdateModal(true);
              }}
              size="small"
            >
              <EditIcon />
            </IconButton>
            {openDelete && (
              <DialogDelete
                open={openDelete}
                setOpen={setDeleteOpen}
                id={user.id}
              />
            )}
            {openUpdate && (
              <FormUser
                action={updateUser}
                showModal={setUpdateOpen}
                open={openUpdateLocal}
                isLoading={loadingMap.updateUser}
                isError={!!errorMap.updateUser}
                user={user}
                title={t("edit")}
                messageSuccess={t("updateSuccess")}
                messageError={t("noUpdate")}
              />
            )}
          </>
        </TableCell>
      </TableRow>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openDeleteSuccess}
        autoHideDuration={3000}
        onClose={() => setOpenDeleteSuccess(false)}
      >
        <Alert
          onClose={() => setOpenDeleteSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {t("deleteUserSuccess")}
        </Alert>
      </Snackbar>
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
    </UserContext.Provider>
  );
}
