import { TableRow, TableCell, Button } from "@material-ui/core";
import { User, UsersListActions } from "../App";
import { Link } from "react-router-dom";
import trash from "./../assets/trash.png";
import "./UserRow.css";
import { createContext, useState } from "react";
import DialogDelete from "./DialogDelete";
import FormUser from "./FormUser";
import { ErrorMap, LoadingMap } from "state-decorator";

type UserRowProps = {
  user: User;
  loadingMap: LoadingMap<UsersListActions>;
  errorMap: ErrorMap<UsersListActions>;
} & Pick<UsersListActions, "deleteUser"> &
  Pick<UsersListActions, "updateUser">;

function deleteConfirmation(
  id: string,
  deleteUser: (userId: string | undefined) => Promise<unknown>
) {
  return (
    <div>
      <Button onClick={() => deleteUser(id)}> Confirmer </Button>
      <Button onClick={() => deleteButton(id, deleteUser)}>Annuler</Button>
    </div>
  );
}

function deleteButton(
  id: string,
  deleteUser: (userId: string | undefined) => Promise<unknown>
) {
  return (
    <Button onClick={() => deleteConfirmation(id, deleteUser)}>
      <img src={trash} />
    </Button>
  );
}

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
          <Button onClick={() => setDeleteOpen(true)}>
            <img src={trash} />
          </Button>
          <DialogDelete
            isError={errorMap.deleteUser}
            isLoading={loadingMap.deleteUser}
            open={openDelete}
            setOpen={setDeleteOpen}
            deleteUser={deleteUser}
            id={user.id}
          />
        </TableCell>
        <TableCell>
          <>
            <Button onClick={() => setUpdateOpen(true)}>Update User</Button>
            <FormUser
              action={p.updateUser}
              showModal={setUpdateOpen}
              open={openUpdate}
              id={user.id}
              isLoading={loadingMap.updateUser}
              isError={errorMap.updateUser}
              user={user}
            />
          </>
        </TableCell>
      </TableRow>
    </UserContext.Provider>
  );
}
