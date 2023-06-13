import { TableRow, TableCell, IconButton } from "@material-ui/core";
import { User, UsersListActions } from "../App";
import { Link } from "react-router-dom";
import "./UserRow.css";
import { createContext, useState } from "react";
import DialogDelete from "./DialogDelete";
import FormUser from "./FormUser";
import { ErrorMap, LoadingMap } from "state-decorator";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type UserRowProps = {
  user: User;
  loadingMap: LoadingMap<UsersListActions>;
  errorMap: ErrorMap<UsersListActions>;
} & Pick<UsersListActions, "deleteUser"> &
  Pick<UsersListActions, "updateUser">;

const initUser = {
  id: "",
  firstName: "",
  lastName: "",
  birthdate: null,
  imageUrl: "",
};

export const UserContext = createContext<User>(initUser);

export default function UserRow(p: UserRowProps) {
  const { user, deleteUser, loadingMap, errorMap } = p;
  const [openDelete, setDeleteOpen] = useState(false);
  const [openUpdate, setUpdateOpen] = useState(false);

  return (
    <UserContext.Provider value={user}>
      <TableRow key={user.id}>
        <TableCell align="center" component="th" scope="user">
          <Link to={`user/${user.id}`}>{user.id}</Link>
        </TableCell>
        <TableCell align="center">{user.firstName}</TableCell>
        <TableCell align="center">{user.lastName}</TableCell>
        <TableCell align="center">
          <>
            <IconButton aria-label="delete" onClick={() => setDeleteOpen(true)}>
              <DeleteIcon />
            </IconButton>
            <IconButton aria-label="delete"></IconButton>
            <DialogDelete
              isError={errorMap.deleteUser}
              isLoading={loadingMap.deleteUser}
              open={openDelete}
              setOpen={setDeleteOpen}
              deleteUser={deleteUser}
              id={user.id}
            />
            <IconButton aria-label="edit" onClick={() => setUpdateOpen(true)}>
              <EditIcon />
            </IconButton>
            <FormUser
              action={p.updateUser}
              showModal={setUpdateOpen}
              open={openUpdate}
              id={user.id}
              isLoading={loadingMap.updateUser}
              isError={errorMap.updateUser}
              user={user}
              title="Edit User"
            />
          </>
        </TableCell>
      </TableRow>
    </UserContext.Provider>
  );
}
