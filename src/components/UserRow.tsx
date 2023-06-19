import { TableRow, TableCell, IconButton } from "@material-ui/core";
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
  const { updateUser, loadingMap, errorMap, setOpenDeleteSuccess } =
    useContext(UsersContext);
  const [openDelete, setDeleteOpen] = useState(false);
  const [openUpdate, setUpdateOpen] = useState(false);

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
            <div>{dayjs(user.birthdate).format("DD/MM/YYYY")}</div>
          ) : (
            <div> {t("noBirthdate")}</div>
          )}
        </TableCell>
        <TableCell align="center">
          <>
            <IconButton aria-label="delete" onClick={() => setDeleteOpen(true)}>
              <DeleteIcon />
            </IconButton>
            <IconButton aria-label="delete"></IconButton>
            <DialogDelete
              open={openDelete}
              setOpen={setDeleteOpen}
              id={user.id}
              setOpenSucces={setOpenDeleteSuccess}
            />
            <IconButton aria-label="edit" onClick={() => setUpdateOpen(true)}>
              <EditIcon />
            </IconButton>
            <FormUser
              action={updateUser}
              showModal={setUpdateOpen}
              open={openUpdate}
              isLoading={loadingMap.updateUser}
              isError={errorMap.updateUser}
              user={user}
              title={t("edit")}
              messageSuccess={t("updateSuccess")}
            />
          </>
        </TableCell>
      </TableRow>
    </UserContext.Provider>
  );
}
