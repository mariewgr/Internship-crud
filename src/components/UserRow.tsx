import { TableRow, TableCell, IconButton, Snackbar } from "@material-ui/core";
import UsersContext, { User } from "../contexts/UsersContext";
import { Link } from "react-router-dom";

import { createContext, useContext, useRef, useState } from "react";
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
  } = useContext(UsersContext);

  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdateLocal, setOpenUpdateLocal] = useState(false);

  const { t } = useTranslation();

  const refDelete = useRef(null);
  const refUpdate = useRef(null);

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
              onClick={() => {
                setOpenDelete(true);
                refDelete.current = document.activeElement;
              }}
              size="small"
              id="deleteButton"
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              aria-label="edit"
              onClick={() => {
                setOpenUpdateLocal(true);
                refUpdate.current = document.activeElement;
              }}
              size="small"
            >
              <EditIcon />
            </IconButton>

            {openUpdateLocal && (
              <FormUser
                submitAction={updateUser}
                setOpenModal={setOpenUpdateLocal}
                openModal={openUpdateLocal}
                isLoading={loadingMap.updateUser}
                isError={!!errorMap.updateUser}
                user={user}
                title={t("edit")}
                messageSuccess={t("updateSuccess")}
                messageError={t("noUpdate")}
                activeObject={refUpdate.current}
              />
            )}
            {openDelete && (
              <DialogDelete
                openModal={openDelete}
                setOpenModal={setOpenDelete}
                id={user.id}
                activeObject={refDelete.current}
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
