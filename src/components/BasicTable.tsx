import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { User, UsersContext, UsersListActions } from "../App";
import UserRow from "./UserRow";
import { ErrorMap, LoadingMap } from "state-decorator";
import { useContext } from "react";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

type BasicTableProps = {
  users: User[];
  rows: string[];
  loadingMap: LoadingMap<UsersListActions>;
  errorMap: ErrorMap<UsersListActions>;
} & Pick<UsersListActions, "deleteUser"> &
  Pick<UsersListActions, "updateUser">;

export default function BasicTable(p: BasicTableProps) {
  const classes = useStyles();
  const users = useContext(UsersContext);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {p.rows.map((row) => (
              <TableCell align="right">{row}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user: User) => (
            <UserRow
              user={user}
              deleteUser={p.deleteUser}
              updateUser={p.updateUser}
              loadingMap={p.loadingMap}
              errorMap={p.errorMap}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
